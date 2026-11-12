# Portfolio

**Live:** [joachimpruegl.me/portfolio](https://joachimpruegl.me/portfolio/)

Static HTML, built with Vite and Tailwind CSS 4 and deployed to GitHub Pages.
The pages ship no JavaScript.

## Develop

```
npm install
npm run dev       # local server
npm run build     # static output in dist/
npm run deploy    # build and publish to gh-pages
```

## Structure

| Path | What it is |
| --- | --- |
| `*.html` | One file per page. Every `.html` file in the root is built automatically. |
| `partials/` | Shared `<head>`, header and footer, included at build time. |
| `src/style.css` | Tokens, typography and layout. |
| `src/fonts/` | Source Serif 4 and Geist, variable, self-hosted. |
| `public/` | Files copied as they are: images, résumé, redirects, sitemap. |

## Partials

```html
<!-- @include head title="…" description="…" path="work.html" -->
<!-- @include header current="work" -->
<!-- @include footer -->
```

`head` writes the title, description, canonical URL and Open Graph tags from
one set of values, so they cannot drift apart. `current` marks the active
navigation link. The plugin is about forty lines in `vite.config.js`.

## Layout

Each page has a reading column (`--measure`, about 66 characters) and a margin
column to its left (`--margin`) for side heads and years. A `.row` puts a
`.side` element in the margin and a `.main` element in the reading column;
`.indent` starts an element at the reading column without a side head. Below
56rem the margin folds away and side heads sit above their text.

## Adding a case study

Copy `meet-app.html`, change the `head` values and the content, then add the
project to the lists in `index.html` and `work.html` and to
`public/sitemap.xml`.

## Images and video

A case study shows images in plates. The first one can fill the plate:

```html
<figure class="plate lead indent">
  <div class="plate-images">
    <img src="/img/work/name.webp" width="2000" height="1151" alt="…" />
  </div>
  <figcaption class="caption">…</figcaption>
</figure>
```

A screen recording goes in the same place. Convert a GIF to video first, it
is far smaller: `ffmpeg -i in.gif -movflags faststart -pix_fmt yuv420p out.mp4`.

```html
<video controls muted loop playsinline preload="none" poster="/img/work/name.webp">
  <source src="/img/work/name.mp4" type="video/mp4" />
</video>
```

`scripts/capture.mjs` takes every screenshot at the same viewport and at
double resolution. The usage is at the top of the file.

## Marker

`<span class="marker">` inside a heading with the class `marked` draws a dark
marker stroke behind the phrase. Use it once per page at most.
