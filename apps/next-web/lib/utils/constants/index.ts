export * from "./misc"; 

export const DEPLOY_URL = ``;
export const TOTAL_DECIMALS = parseInt(process.env.TOTAL_DECIMALS ?? "1000000000");

export const SHORT_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.NEXT_ADMIN_APP_DOMAIN || "tesior.xyz";

export const HOME_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;

export const APP_HOSTNAMES = new Set([
  `${process.env.NEXT_PUBLIC_APP_DOMAIN}`,   // remove after app.${process.env.NEXT_PUBLIC_APP_DOMAIN} is bought
  `app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "localhost:5000",
  "localhost",
]);

const ADMIN_OR_APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? process.env.NEXT_ADMIN_APP_DOMAIN;

// in prod, change to app.${process.env.NEXT_PUBLIC_APP_DOMAIN} after buying a domain
export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://${ADMIN_OR_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${ADMIN_OR_APP_DOMAIN}`
      : "http://localhost:5000";

export const ADMIN_HOSTNAMES = new Set([
  `${process.env.NEXT_ADMIN_APP_DOMAIN}`,   // remove after admin.${process.env.NEXT_PUBLIC_APP_DOMAIN} is bought
  `admin.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "admin.localhost:5000",
]);

export const API_HOSTNAMES = new Set([
  `api.${ADMIN_OR_APP_DOMAIN}`,
  `api-staging.${ADMIN_OR_APP_DOMAIN}`,
  `api.${SHORT_DOMAIN}`,
  "api.localhost:5000",
]);

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://api.${ADMIN_OR_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://api-staging.${ADMIN_OR_APP_DOMAIN}`
      : "http://api.localhost:5000";

export const TESIOR_PROJECT_ID = "tesior";
