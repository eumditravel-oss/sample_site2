import { existsSync, readFileSync } from "node:fs";

const read = (file) => readFileSync(file, "utf8");
const required = [
  "client/public/dongseong-logo.svg",
  "client/public/dongseong-logo-white.svg",
  "client/public/field-01.jpg",
  "client/public/field-02.jpg",
  "client/public/field-03.jpg",
  "client/src/config/company.ts",
  "client/src/data/projects.ts",
  "client/src/site2.css",
  "client/src/pages/Contact.tsx",
  "client/src/pages/Privacy.tsx",
];

for (const file of required) {
  if (!existsSync(file)) throw new Error(`Required SITE 2 file is missing: ${file}`);
}

const sourceFiles = [
  "client/src/App.tsx",
  "client/src/components/SiteShell.tsx",
  "client/src/pages/Home.tsx",
  "client/src/pages/Contact.tsx",
  "client/src/pages/Projects.tsx",
  "client/src/site2.css",
].map(read).join("\n");

const forbidden = [
  "dongseong-consultations",
  "010-0000-0000",
  "contact@dongseong",
  "서울특별시 ○○구",
  "SubNavigation",
  "sub-layout",
  "pagination",
  "brand-mark_5f5a3175",
  "construction-concrete-texture",
];

for (const token of forbidden) {
  if (sourceFiles.includes(token)) throw new Error(`Legacy or fabricated token remains: ${token}`);
}

const home = read("client/src/pages/Home.tsx");
for (const token of ["setInterval", "ArrowLeft", "ArrowRight", "onPointerDown", "scrollIntoView", "aria-live", "heroPaused ? <Play /> : <Pause />"]) {
  if (!home.includes(token)) throw new Error(`Required carousel behavior is missing: ${token}`);
}

const app = read("client/src/App.tsx");
for (const route of ["/company", "/business", "/projects", "/quality", "/news", "/contact", "/privacy"]) {
  if (!app.includes(route)) throw new Error(`Required route is missing: ${route}`);
}

const css = read("client/src/site2.css");
for (const token of ["prefers-reduced-motion", "scroll-snap-type", "focus-visible", "--motion-fast"]) {
  if (!css.includes(token)) throw new Error(`Required accessibility/motion rule is missing: ${token}`);
}

for (const logo of ["client/public/dongseong-logo.svg", "client/public/dongseong-logo-white.svg"]) {
  const svg = read(logo);
  if (svg.includes("<image") || svg.includes("data:image")) throw new Error(`Logo is not pure vector: ${logo}`);
}

const removed = [
  "client/src/dongseong.css",
  "client/src/sub-navigation.css",
  "client/src/components/HomeSections.tsx",
  "client/src/pages/ConsultationList.tsx",
  "client/public/manus-storage/brand-mark_5f5a3175.png",
];
for (const file of removed) {
  if (existsSync(file)) throw new Error(`Legacy file should have been removed: ${file}`);
}

console.log("SITE 2 independence, interaction, data-integrity, and vector-logo checks passed.");
