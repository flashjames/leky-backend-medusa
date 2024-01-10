import ProductVariantService from "@medusajs/medusa/dist/services/product-variant"
import ProductService from "@medusajs/medusa/dist/services/product"
import { indexTypes } from "medusa-core-utils"
import { isSearchEngineInstalledResolutionKey } from "@medusajs/medusa/dist/loaders/plugins"

const searchFields = [
  "id",
  "title",
  "subtitle",
  "status",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "collection_id",
  "type_id",
  "origin_country",
  "created_at",
  "updated_at",
  "metadata",
]

const searchRelations = [
  "variants",
  "categories",
  "tags",
  "type",
  "collection",
  "variants.prices",
  "variants.options",
  "options",
]

class ProductSearchSubscriber {
  constructor({eventBusService, searchService, productService, pricingService}) {
    this.eventBus_ = eventBusService
    this.searchService_ = searchService
    this.productService_ = productService
    this.pricingService_ = pricingService
    this.eventBus_.subscribe(
      ProductService.Events.CREATED,
      this.handleProductCreation
    )

    this.eventBus_.subscribe(
      ProductService.Events.UPDATED,
      this.handleProductUpdate
    )

    this.eventBus_.subscribe(
      ProductService.Events.DELETED,
      this.handleProductDeletion
    )

    this.eventBus_.subscribe(
      ProductVariantService.Events.CREATED,
      this.handleProductVariantChange
    )

    this.eventBus_.subscribe(
      ProductVariantService.Events.UPDATED,
      this.handleProductVariantChange
    )

    this.eventBus_.subscribe(
      ProductVariantService.Events.DELETED,
      this.handleProductVariantChange
    )
  }

  handleProductCreation = async (data) => {
    console.log("handleProductCreation")
    const product = await this.retrieveProduct_(data.id)
    await this.searchService_.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }

  retrieveProduct_ = async (product_id) => {
    const computedProduct = await this.productService_.retrieve(product_id, {
      select: searchFields,
      relations: searchRelations,
    })
    const computedProducts = [computedProduct]
    const productWithPrices = await this.pricingService_.setProductPrices(computedProducts, {
      //cart_id: "cart_01GYA6KYR0NQV8S5JBDQWK9VD0",
      region_id: "reg_01HK2SX0JEB6Q6F7MBFAM4YS8E", // TODO: Change this to be dynamically added, i.e. not hardcorded as of now
      currency_code: "EUR",
      include_discount_prices: true,
    })
    return productWithPrices[0]
  }

  handleProductUpdate = async (data) => {
    console.log("handleProductUpdate")
    const product = await this.retrieveProduct_(data.id)
    await this.searchService_.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }

  handleProductDeletion = async (data) => {
    await this.searchService_.deleteDocument(ProductService.IndexName, data.id)
  }

  handleProductVariantChange = async (data) => {
    const product = await this.retrieveProduct_(data.product_id)
    await this.searchService_.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }
}

export default ProductSearchSubscriber
