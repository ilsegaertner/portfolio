import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

const root = import.meta.dirname;
const SITE = "https://joachimpruegl.me/portfolio/";

/**
 * Build-time HTML partials, so the header, footer and <head> live in one place
 * and every page is still emitted as plain static HTML.
 *
 *   <!-- @include head title="…" description="…" path="work.html" -->
 *   <!-- @include header current="work" -->
 *
 * Inside a partial:
 *   {{name}}          the attribute value, HTML-escaped
 *   {{current:work}}  expands to aria-current="page" when current="work"
 *   {{site}}          the absolute site URL
 */
function htmlPartials() {
  const INCLUDE = /<!--\s*@include\s+([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g;
  const ATTR = /([\w-]+)="([^"]*)"/g;

  const render = (html, depth = 0) =>
    html.replace(INCLUDE, (_, name, rawAttrs) => {
      if (depth > 5) throw new Error(`Partial "${name}" is nested too deeply`);
      const file = path.join(root, "partials", `${name}.html`);
      const attrs = Object.fromEntries(
        [...rawAttrs.matchAll(ATTR)].map(([, k, v]) => [k, v])
      );
      const out = fs
        .readFileSync(file, "utf8")
        .replace(/\{\{current:([\w-]+)\}\}/g, (_, key) =>
          attrs.current === key ? 'aria-current="page"' : ""
        )
        .replace(/\{\{site\}\}/g, SITE)
        .replace(/\{\{([\w-]+)\}\}/g, (_, key) => attrs[key] ?? "");
      return render(out, depth + 1);
    });

  return {
    name: "html-partials",
    transformIndexHtml: { order: "pre", handler: (html) => render(html) },
    handleHotUpdate({ file, server }) {
      if (file.includes(`${path.sep}partials${path.sep}`)) {
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}

// Every .html file in the project root is a page.
const pages = Object.fromEntries(
  fs
    .readdirSync(root)
    .filter((f) => f.endsWith(".html"))
    .map((f) => [f.replace(/\.html$/, ""), path.resolve(root, f)])
);

export default defineConfig({
  plugins: [htmlPartials(), tailwindcss()],
  base: "/portfolio/",
  build: { rollupOptions: { input: pages } },
});
