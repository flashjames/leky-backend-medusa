import { MedusaContainer } from "@medusajs/modules-sdk"
import { Logger } from "@medusajs/types"
import AlgoliaService from "../services/algolia"
import { AlgoliaPluginOptions } from "../types"

export default async (
  container: MedusaContainer,
  options: AlgoliaPluginOptions
) => {
      console.log("called-first-new")
    console.log("called23")
    console.log("called-last")

  const logger: Logger = container.resolve("logger")
  try {
    const algoliaService: AlgoliaService = container.resolve("algoliaService")

    const { settings } = options

    await Promise.all(
      Object.entries(settings || {}).map(async ([indexName, value]) => {
        return await algoliaService.updateSettings(indexName, value)
      })
    )
  } catch (err) {
    // ignore
    logger.warn(err)
  }
}
