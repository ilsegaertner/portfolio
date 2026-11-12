// Consistent screenshots for the case studies.
//
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/capture.mjs                 capture every shot below
//   node scripts/capture.mjs cub-react       only shots whose name starts with "cub-react"
//   node scripts/capture.mjs --login cub     open a browser, log in by hand, press Enter;
//                                            the session is saved and reused for "cub…" shots
//
// Output: captures/<name>.png at double resolution, without browser chrome.

import { chromium } from "playwright";
import fs from "node:fs";
import readline from "node:readline/promises";

const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

// One entry per image. `selector` crops to a single element (a card, a chart);
// `before` runs in the page first, for typing a search or opening a dialog.
const shots = [
  { name: "cub-react-catalog", url: "https://cub-film-data.netlify.app/", viewport: DESKTOP, auth: "cub-react" },
  { name: "cub-react-catalog-phone", url: "https://cub-film-data.netlify.app/", viewport: PHONE, auth: "cub-react" },
  { name: "cub-angular-catalog", url: "https://ilsegaertner.github.io/CUB-Film-Angular-client/", viewport: DESKTOP, auth: "cub-angular" },
  { name: "cub-angular-catalog-phone", url: "https://ilsegaertner.github.io/CUB-Film-Angular-client/", viewport: PHONE, auth: "cub-angular" },
  { name: "meet-app", url: "https://joachimpruegl.me/Meet-app/", viewport: DESKTOP },
  { name: "meet-app-phone", url: "https://joachimpruegl.me/Meet-app/", viewport: PHONE },
  // Example of a detail crop:
  // { name: "meet-app-chart", url: "https://joachimpruegl.me/Meet-app/", viewport: DESKTOP,
  //   selector: ".charts-container",
  //   before: async (page) => { await page.fill("#city input", "Berlin"); } },
];

const authFile = (key) => `.auth/${key}.json`;
const args = process.argv.slice(2);
const browser = await chromium.launch({
  headless: args[0] !== "--login",
  executablePath: process.env.CHROME_PATH || undefined,
});

if (args[0] === "--login") {
  const key = args[1];
  const shot = shots.find((s) => s.auth?.startsWith(key ?? ""));
  if (!key || !shot) {
    console.error("Usage: node scripts/capture.mjs --login <auth name>");
    process.exit(1);
  }
  const context = await browser.newContext({ viewport: DESKTOP });
  const page = await context.newPage();
  await page.goto(shot.url);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await rl.question(`Log in to ${shot.url} in the browser window, then press Enter here. `);
  rl.close();
  fs.mkdirSync(".auth", { recursive: true });
  await context.storageState({ path: authFile(shot.auth) });
  console.log(`Saved ${authFile(shot.auth)}`);
} else {
  fs.mkdirSync("captures", { recursive: true });
  for (const shot of shots.filter((s) => !args[0] || s.name.startsWith(args[0]))) {
    const saved = shot.auth && fs.existsSync(authFile(shot.auth));
    if (shot.auth && !saved) {
      console.warn(`${shot.name}: no saved login, run --login ${shot.auth} first. Capturing anyway.`);
    }
    const context = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: 2,
      colorScheme: "light",
      reducedMotion: "reduce",
      storageState: saved ? authFile(shot.auth) : undefined,
    });
    const page = await context.newPage();
    try {
      await page.goto(shot.url, { waitUntil: "networkidle" });
      if (shot.before) await shot.before(page);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      const target = shot.selector ? page.locator(shot.selector).first() : page;
      await target.screenshot({ path: `captures/${shot.name}.png` });
      console.log(`captures/${shot.name}.png`);
    } catch (error) {
      console.error(`${shot.name}: ${error.message.split("\n")[0]}`);
    }
    await context.close();
  }
}

await browser.close();
