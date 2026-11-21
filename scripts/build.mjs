// Bundles the content script and copies the static files into dist/, which is
// the folder Chrome loads with "Load unpacked".
import { build } from "esbuild";
import { cp, mkdir, readFile, rm } from "node:fs/promises";

const outdir = "dist";
const manifest = JSON.parse(await readFile("static/manifest.json", "utf8"));
// The manifest names the script Chrome loads and the oldest Chrome it runs on,
// so the bundle's name and target follow it rather than repeating it.
const [script] = manifest.content_scripts[0].js;
const scriptName = script.replace(/\.js$/, "");

await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });
await build({
  entryPoints: { [scriptName]: "src/main.ts" },
  outdir,
  bundle: true,
  format: "iife",
  target: `chrome${manifest.minimum_chrome_version}`,
  minify: false,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
});
await cp("static", outdir, { recursive: true });
