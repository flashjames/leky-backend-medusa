import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { algoliaProductsIndex } from "../lib/algolia-client";
import { transformProduct } from "./algolia-transform";

export default async function handleProductChange({
  event,
  container,
  logger,
}: SubscriberArgs) {
  const productId = event.data.id as string;

  try {
    if (event.name === "product.deleted") {
      await algoliaProductsIndex.deleteObject(productId);
      logger.info(`Algolia: deleted product ${productId}`);
      return;
    }

    const query = container.resolve("query");

    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "description",
        "handle",
        "thumbnail",
        "metadata",
        "variants.*",
        "variants.prices.*",
        "variants.options.*",
        "collection.*",
        "tags.*",
        "type.*",
        "categories.*",
        "options.*",
        "images.*",
      ],
      filters: { id: productId },
    });

    const product = products[0];
    if (!product) {
      logger.warn(`Algolia: product ${productId} not found`);
      return;
    }

    const transformed = transformProduct(product);
    await algoliaProductsIndex.saveObject(transformed);
    logger.info(`Algolia: indexed product ${productId}`);
  } catch (error) {
    logger.error(`Algolia: failed to index product ${productId}`, error);
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "product.deleted"],
};