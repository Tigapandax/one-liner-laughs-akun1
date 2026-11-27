// One-Liner Laughs — make.fun entry.
// Reads the one funny line from one-line.txt and writes it to
// /output/entry.txt, where the sealed scorer reads it (1-200 chars).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "one-line.txt");
const raw = readFileSync(sourcePath, "utf8");
const line = raw.trim();

// Gate validation (competition.yaml: /output/entry.txt must be UTF-8
// text of 1 to 200 characters, not only white space).
if (line.length < 1 || line.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${line.length}`);
}
if (line !== line.trim()) {
  throw new Error("entry has leading or trailing whitespace");
}
if (/[\r\n]/.test(line)) {
  throw new Error("entry must be a single line");
}
if (!/[.!?…]$/.test(line)) {
  throw new Error("entry must end with terminal punctuation");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const target = join(outputDir, "entry.txt");
writeFileSync(target, line + "\n", "utf8");

// Read it back: what lands on disk must be exactly the line we wrote.
const written = readFileSync(target, "utf8").trim();
if (written !== line) {
  throw new Error("entry.txt does not match one-line.txt");
}

console.log(line);
