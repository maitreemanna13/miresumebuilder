import type { MetadataRoute } from "next";

const SITE_URL = "https://www.miresumebuilder.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /build is the editor itself (infinite states, no unique content to
      // index) and /dashboard is admin-only — neither belongs in search
      // results. The API isn't content either.
      disallow: ["/build", "/dashboard", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
