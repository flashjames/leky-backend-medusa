import algoliasearch from "algoliasearch";
import { loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const appId = process.env.ALGOLIA_APP_ID || "";
const apiKey = process.env.ALGOLIA_ADMIN_API_KEY || "";

if (!appId || !apiKey) {
  console.warn("Algolia: credentials not configured, search indexing disabled");
}

const client = algoliasearch(appId, apiKey);
const productsIndex = client.initIndex("products");

export { client as algoliaClient, productsIndex as algoliaProductsIndex };