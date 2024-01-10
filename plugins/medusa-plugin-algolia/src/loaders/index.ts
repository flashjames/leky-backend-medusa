import { Logger, MedusaContainer } from "@medusajs/modules-sdk"
import AlgoliaService from "../services/algolia"
import { AlgoliaPluginOptions } from "../types"
import ProductSearchSubscriber from "../subscribers"

export default async (
  container: MedusaContainer,
  options: AlgoliaPluginOptions
) => {
  const logger: Logger = container.resolve("logger")
  try {
    const algoliaService: AlgoliaService = container.resolve("algoliaService")

    const { settings } = options

    await Promise.all(
      Object.entries(settings || {}).map(async ([indexName, value]) => {
        return await algoliaService.updateSettings(indexName, value)
      })
    )


    const eventBusService = container.resolve("eventBusService")
    const productService = container.resolve("productService")
    const pricingService = container.resolve("pricingService")
    //const searchService = container.resolve("searchService")

    try {
      new ProductSearchSubscriber({eventBusService, productService, searchService: algoliaService, pricingService})
    } catch(e) {
      console.log(e)
    }
    console.log("called-first-new!!!!!")
    console.log("called23")
    console.log("called-last")
  } catch (err) {
    // ignore
    logger.warn(err)
  }
}
