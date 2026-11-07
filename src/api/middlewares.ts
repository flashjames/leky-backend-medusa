import type {
  MiddlewaresConfig,
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/medusa";


const allowedOrigin = (hostUrl) => {
  const STORE_CORS = process.env.STORE_CORS
  let storeCorsUrls = STORE_CORS.split(",")
  for(var url of storeCorsUrls) {
    if(url.includes(hostUrl)) {
      return true
    }
  }
  return false
}

async function logger(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  /*
  TODO:
  Remove this code, i.e. solve the original error.
  Which is that origin wont work on railway if this code is not here
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
