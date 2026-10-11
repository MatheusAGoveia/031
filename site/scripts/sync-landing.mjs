import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "landing-source");
const html = readFileSync(path.join(source, "index.html"), "utf8");
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
if (!body) throw new Error("Landing HTML body is missing.");

writeFileSync(path.join(root, "app", "landing-markup.ts"), `const markup = ${JSON.stringify(body)};\nexport default markup;\n`);
writeFileSync(path.join(root, "public", "landing.css"), readFileSync(path.join(source, "styles.css")));
writeFileSync(path.join(root, "public", "landing.js"), readFileSync(path.join(source, "app.js")));
