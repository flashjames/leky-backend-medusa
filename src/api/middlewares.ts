import type {
  MiddlewaresConfig,
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/medusa";


const allowedOrigin = (hostUrl) => {
  const STORE_CORS = process.env.STORE_CORS
  let storeCorsUrls = STORE_CORS.split(",")
  console.log(hostUrl, storeCorsUrls, "storeCorsUrls")
  for(var url of storeCorsUrls) {
    if(url.includes(hostUrl)) {
      return true
    }
  }
  return false
}

let i = 0
async function logger(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  /*
  TODO: Change to right url (["https://byq-storefront-medusa.vercel.app"])
  - Hacky, check url that the response was from and set the url to it (compare to the allowed origins)
  - Less hacky: Check allowed origins from enviroment variable
   */


    const hostUrl = req.get('origin')
  const isAllowedOrigin = allowedOrigin(hostUrl)

  if(isAllowedOrigin) {
    const allowedOriginUrl = req.protocol + hostUrl
    res.header("Access-Control-Allow-Origin", [allowedOriginUrl])
  }
  res.header("Access-Control-Allow-Origin", ["https://byq-storefront-medusa.vercel.app"])
  next();
}

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/store/",
      middlewares: [logger],
    },
  ],
};
