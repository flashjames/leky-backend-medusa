// understand(2024): This doesnt seem to be defined anymore
const variantKeys = require("@medusajs/utils").variantKeys
const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:7003";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || "";
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || "";



const prefix = `variant`
const transformProduct = (product) => {
  let transformedProduct = { ...product }

  const initialObj = variantKeys.reduce((obj, key) => {
    obj[`${prefix}_${key}`] = []
    return obj
  }, {})
  initialObj[`${prefix}_options_value`] = []

  const flattenedVariantFields = product.variants.reduce((obj, variant) => {
    variantKeys.forEach((k) => {
      if (k === "options" && variant[k]) {
        const values = variant[k].map((option) => option.value)
        obj[`${prefix}_options_value`] =
          obj[`${prefix}_options_value`].concat(values)
        return
      }
      return variant[k] && obj[`${prefix}_${k}`].push(variant[k])
    })
    return obj
  }, initialObj)

  transformedProduct.objectID = product.id
  transformedProduct.type_value = product.type && product.type.value
  transformedProduct.collection_title =
    product.collection && product.collection.title
  transformedProduct.collection_handle =
    product.collection && product.collection.handle
  transformedProduct.tags_value = product.tags
                                ? product.tags.map((t) => t.value)
                                : []
  transformedProduct.categories = (product?.categories || []).map((c) => c.name)

  const prod = {
    ...transformedProduct,
    ...flattenedVariantFields,
  }

  return prod
}



const parseCategories = (categories) => {
  let range = n => [...Array(n).keys()]
  const createHiearchy = (key) => {
    const result = {}
    let str = ""
    for(var index of range(categories.length)) {
      const level = categories[index][key]
      const levelName = `lvl${index}`
      str += level
      result[levelName] = str
      if(index !== categories.length) {
        str += " > "
      }
    }

    return result
  }


  const categoriesWithName = createHiearchy("name")
  const categoriesWithId = createHiearchy("id")

  return {categoriesWithName, categoriesWithId}
}



const attributesToRetrieve = [
  "id",
  "title",
  "description",
  "handle",
  "thumbnail",
  "variants",
  "variant_sku",
  "options",
  "collection_title",
  "collection_handle",
  "images",
  "categoriesWithName",
  "categoriesWithId",
  "brand",
  "variants",
  "variants.prices",
  "variants.options",
  "options",
]

let first = true


const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      serve: true,
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "true",
      },
    },
  },
  {
    resolve: `@flashjames/medusa-plugin-algolia`,
    options: {
      applicationId: process.env.ALGOLIA_APP_ID,
      adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
      settings: {
        products: {
          maxValuesPerFacet: 1000,
          maxFacetHits: 100, // we had 1000 here, before I changed it when starting upgrade
          searchableAttributes: ["title", "description", "brand"],
          attributesForFaceting: [
            "categoriesWithName",
            "categoriesWithId",
            "categoriesBelongingToWithId",
            "categoriesBelongingToWithName",
            "brand",
            "searchable(brand)",
          ],
          replicas: [
            'products_newest',
            'products_price_desc',
            'products_price_asc',
            'products_name_desc',
            'products_name_asc',
          ],
          distinct: 1,
          attributeForDistinct: 'id',
          attributesToRetrieve: attributesToRetrieve,
          transformer: (product,a,b) => {
            // TODO: Move to separate file


            const transformed = transformProduct(product)

            //delete transformed.variants
            //delete transformed.metadata
            //delete transformed.description
            const parsed = {...transformed}
            parsed.objectID = product.id

            const {categories} = product
            if(categories !== undefined && categories.length > 0) {
              const {categoriesWithName, categoriesWithId} = parseCategories(categories)
              parsed.categoriesWithName = categoriesWithName
              parsed.categoriesWithId = categoriesWithId

              const categoriesBelongingToWithId = []
              const categoriesBelongingToWithName = []
              for(var category of categories) {
                const {id, name} = category
                categoriesBelongingToWithId.push(id)
                categoriesBelongingToWithName.push(name)
              }
              parsed.categoriesBelongingToWithId = categoriesBelongingToWithId
              parsed.categoriesBelongingToWithName = categoriesBelongingToWithName
            }

            const first_price = transformed.variants[0].prices[0].amount
            parsed["price_approximate_for_sort"] = first_price

            if(transformed.metadata && "product_brand" in transformed.metadata) {
              const {product_brand} = product.metadata
              parsed.brand = product_brand
            }

            if(first) {
              first = false
              //console.log(parsed.categoriesBelongingToWithId, parsed.categoriesBelongingToWithName)
            }
            return parsed
          },
        },


      },
    },
  },

];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
  featureFlags: {
    product_categories: true,
  },
};
