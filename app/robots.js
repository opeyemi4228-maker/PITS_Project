import { site } from "@/lib/site";

/* The register is not a public document. Each private route also sets its own
   `robots` metadata and next.config.mjs sends no-store on it; this keeps
   well behaved crawlers from asking in the first place. */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/portal", "/api/", "/login", "/reset", "/secure"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
