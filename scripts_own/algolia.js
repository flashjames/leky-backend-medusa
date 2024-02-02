import algoliaConfig from '../algoliaConfig.js';
const {attributesForFaceting, replicas} = algoliaConfig;

import algoliasearch from 'algoliasearch';
import path from "path";
import dotenv from "dotenv";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);


const setSortorder = (index, customRanking) => {
  index.setSettings({
    customRanking: [
      customRanking,
    ],
    'relevancyStrictness': 0
  }).then(() => {
    console.log("done setSortorderForReplicas")
  });

}





const setSortorderForReplicas = () => {
  var replicaIndex = client.initIndex('products_name_asc');
  setSortorder(replicaIndex, "asc(title)")

  var replicaIndex = client.initIndex('products_name_desc');
  setSortorder(replicaIndex, "desc(title)")


  var replicaIndex = client.initIndex('products_price_desc');
  setSortorder(replicaIndex, "desc(price_approximate_for_sort)")
  var replicaIndex = client.initIndex('products_price_asc');
  setSortorder(replicaIndex, "asc(price_approximate_for_sort)")


  var replicaIndex = client.initIndex('products_newest');
  setSortorder(replicaIndex, "desc(created_at)")

}



/*
   This probably only need to be done for main index ('products')
   and not for the virtual replicas - since this seems to be synced to them anyways
*/
const setAttributesForFaceting = () => {
  const indexes = [
    "products",
    ...replicas

  ]
  for(var [i, replicaName] of indexes.entries()) {
    var index = client.initIndex(replicaName);
    index.setSettings({
      attributesForFaceting: attributesForFaceting,
    }).then(() => {
      console.log("done setAttributesForFaceting")
    });
  }
}


//setSortorderForReplicas()
//setAttributesForFaceting()
