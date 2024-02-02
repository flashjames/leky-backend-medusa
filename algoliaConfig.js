// understand(2024): This doesnt seem to be defined anymore
const variantKeys = require("@medusajs/utils").variantKeys

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

const attributesForFaceting = [
  "filterOnly(categoriesWithName)",
  "filterOnly(categoriesWithId)",
  "filterOnly(categoriesBelongingToWithId)",
  "filterOnly(categoriesBelongingToWithName)",
  "searchable(brand)",
]

const replicas = [
  'products_newest',
  'products_price_desc',
  'products_price_asc',
  'products_name_desc',
  'products_name_asc',
]

let first = true

const options = {
    applicationId: process.env.ALGOLIA_APP_ID,
    adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
    settings: {
      products: {
        maxValuesPerFacet: 1000,
        maxFacetHits: 100, // we had 1000 here, before I changed it when starting upgrade
        searchableAttributes: ["title", "description", "brand"],
        attributesForFaceting: attributesForFaceting,
        replicas: replicas,
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

}


module.exports = {
  options,
  attributesToRetrieve,
  replicas
};
