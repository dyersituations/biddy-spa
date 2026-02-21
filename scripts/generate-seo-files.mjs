import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const publicDir = resolve(rootDir, "public");
const siteUrl = "https://biddyonthebench.com";
const indexable = true;

const today = new Date().toISOString().split("T")[0];

const robotsContent = indexable
  ? `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
  : `User-agent: *
Disallow: /
`;

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, "robots.txt"), robotsContent, "utf8");
writeFileSync(resolve(publicDir, "sitemap.xml"), sitemapContent, "utf8");
