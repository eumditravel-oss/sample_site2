import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "client/public/dongseong-logo-source.jpg",
  "client/public/field-01.jpg",
  "client/public/field-02.jpg",
  "client/public/field-03.jpg",
  "client/public/og.png",
  "client/src/dongseong.css",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) throw new Error(`Required site asset is missing: ${file}`);
}

const shell = readFileSync("client/src/components/SiteShell.tsx", "utf8");
const home = readFileSync("client/src/components/HomeSections.tsx", "utf8");
const html = readFileSync("client/index.html", "utf8");

for (const text of ["동성건설", "DONGSEONG CONSTRUCTION"]) {
  if (!shell.includes(text) && !html.includes(text)) throw new Error(`Brand text is missing: ${text}`);
}
if (!home.includes("도시의 기반을 읽고")) throw new Error("Main brand headline is missing.");
if (shell.includes("선진건설") || html.includes("선진건설")) throw new Error("Previous brand text remains in the site shell.");

console.log("Dongseong brand, content, and required asset verification passed.");
