import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

const home = read("index.html");
const script = read("script.js");
const sitemap = read("sitemap.xml");
const foundingPass = read("founding-pass/index.html");

assert.match(home, /Preordina gratis su App Store/);
assert.match(home, /https:\/\/apps\.apple\.com\/it\/app\/pmuloop\/id6805815193/);
assert.match(home, /"@type": "SoftwareApplication"/);
assert.match(home, /Paola Benchea/);
assert.match(
  home,
  /https:\/\/www\.pmuroma\.it\/\?utm_source=pmuloop\.com&amp;utm_medium=referral&amp;utm_campaign=studio_origin/,
);
assert.doesNotMatch(home, /Scopri l'anteprima|In arrivo su App Store|Pre-lancio/);
assert.match(foundingPass, /<meta name="robots" content="noindex, follow">/);
assert.match(foundingPass, /Offerta conclusa/);
assert.doesNotMatch(sitemap, /founding-pass/);

const resources = [
  "guide/scheda-cliente-pmu/index.html",
  "guide/pigmenti-lotti-tracciabilita/index.html",
  "guide/agenda-pmu-ritocchi-scadenze/index.html",
  "storia/come-nasce-pmuloop/index.html",
];

for (const relativePath of resources) {
  const absolutePath = path.join(root, relativePath);
  assert.ok(fs.existsSync(absolutePath), `${relativePath} is missing`);
  const html = read(relativePath);
  assert.match(html, /<link rel="canonical" href="https:\/\/pmuloop\.com\//);
  assert.match(html, /Preordina gratis su App Store/);
  const publicUrl = `https://pmuloop.com/${relativePath.replace(/index\.html$/, "")}`;
  assert.match(sitemap, new RegExp(publicUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

assert.match(script, /utm_campaign/);
assert.match(script, /studio_origin/);
assert.match(script, /itsct/);
assert.ok(
  fs.statSync(path.join(root, "assets/app-home.png")).size > 100_000,
  "Current app screenshot is missing or unexpectedly small",
);

console.log("PMULoop public-site QA passed.");
