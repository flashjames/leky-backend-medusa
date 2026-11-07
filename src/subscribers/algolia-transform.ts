/**
 * Transform a product from Medusa v2 Query format to Algolia index format.
 * Adapted from the v1 algoliaConfig.js transformer.
 */

interface AlgoliaProduct {
  objectID: string;
  title: string;
  description?: string;
  handle?: string;
  thumbnail?: string;
  [key: string]: unknown;
}

export function transformProduct(product: Record<string, unknown>): AlgoliaProduct {
  const result: AlgoliaProduct = {
    objectID: product.id as string,
    title: (product.title as string) || "",
    description: (product.description as string) || "",
    handle: (product.handle as string) || "",
    thumbnail: (product.thumbnail as string) || "",
  };

  // Flatten variant fields
  const variants = (product.variants as Record<string, unknown>[]) || [];
  const variantSkus: string[] = [];
  const variantPrices: number[] = [];
  const variantOptionValues: string[] = [];

  for (const variant of variants) {
    if (variant.sku) variantSkus.push(variant.sku as string);
    if (variant.title) variantOptionValues.push(variant.title as string);

    const prices = (variant.prices as Record<string, unknown>[]) || [];
    for (const price of prices) {
      if (price.amount != null) {
        variantPrices.push(price.amount as number);
      }
    }

    const options = (variant.options as Record<string, unknown>[]) || [];
    for (const option of options) {
      if (option.value) variantOptionValues.push(option.value as string);
    }
  }

  result.variant_sku = variantSkus;
  result.variant_options_value = variantOptionValues;

  // First variant first price for sorting
  if (variantPrices[0] != null) {
    result.price_approximate_for_sort = variantPrices[0];
  }

  // Collection
  const collection = product.collection as Record<string, unknown> | undefined;
  if (collection) {
    result.collection_title = collection.title;
    result.collection_handle = collection.handle;
  }

  // Type
  const type = product.type as Record<string, unknown> | undefined;
  if (type) {
    result.type_value = type.value;
  }

  // Tags
  const tags = (product.tags as Record<string, unknown>[]) || [];
  result.tags_value = tags.map((t) => t.value as string);

  // Categories
  const categories = (product.categories as Record<string, unknown>[]) || [];
  if (categories.length > 0) {
    result.categories = categories.map((c) => c.name as string);

    const categoriesWithName: Record<string, string> = {};
    const categoriesWithId: Record<string, string> = {};
    let namePath = "";
    let idPath = "";

    categories.forEach((cat, idx) => {
      const levelKey = `lvl${idx}`;
      namePath += (idx > 0 ? " > " : "") + (cat.name || "");
      idPath += (idx > 0 ? " > " : "") + (cat.id || "");
      categoriesWithName[levelKey] = namePath;
      categoriesWithId[levelKey] = idPath;
    });

    result.categoriesWithName = categoriesWithName;
    result.categoriesWithId = categoriesWithId;
    result.categoriesBelongingToWithId = categories.map((c) => c.id as string);
    result.categoriesBelongingToWithName = categories.map((c) => c.name as string);
  }

  // Brand from metadata
  const metadata = product.metadata as Record<string, unknown> | undefined;
  if (metadata?.product_brand) {
    result.brand = metadata.product_brand as string;
  }

  return result;
}
