import { defineMiddlewares } from "@medusajs/framework/http";
import type {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework/http";

const allowedOrigin = (hostUrl: string) => {
  const STORE_CORS = process.env.STORE_CORS;
  if (!STORE_CORS) return false;
  const storeCorsUrls = STORE_CORS.split(",");
  for (const url of storeCorsUrls) {
    if (url.includes(hostUrl)) {
      return true;
    }
  }
  return false;
};

async function corsMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const hostUrl = req.get("origin");
  if (hostUrl && allowedOrigin(hostUrl)) {
    res.setHeader("Access-Control-Allow-Origin", hostUrl);
  }
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://byq-storefront-medusa.vercel.app"
  );
  next();
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*",
      middlewares: [corsMiddleware],
    },
  ],
});