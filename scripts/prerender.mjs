import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const distDir = resolve(process.cwd(), "dist");
const ssrEntryPath = resolve(process.cwd(), "dist-ssr", "entry-server.js");
const indexPath = resolve(distDir, "index.html");

if (!existsSync(indexPath)) {
  throw new Error("Missing dist/index.html. Run vite build first.");
}

if (!existsSync(ssrEntryPath)) {
  throw new Error(
    "Missing dist-ssr/entry-server.js. Run the SSR build before prerender.",
  );
}

const template = readFileSync(indexPath, "utf8");
const { render } = await import(pathToFileURL(ssrEntryPath).href);
const appHtml = await render("/");

if (!template.includes('<div id="root"></div>')) {
  throw new Error('Expected "<div id=\\"root\\"></div>" in dist/index.html');
}

const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
writeFileSync(indexPath, html, "utf8");
rmSync(resolve(process.cwd(), "dist-ssr"), { recursive: true, force: true });
