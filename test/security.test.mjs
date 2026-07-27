import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("tracked onscreen config contains no provider credential", () => {
  const config = readFileSync(new URL("../conf/onscreen-agent.yaml", import.meta.url), "utf8");
  assert.match(config, /^api_key: ["']{2}$/mu);
  assert.doesNotMatch(config, /api_key:\s+[^"'\s][^\n]+/u);
});

test("tracked files contain no common live-secret shapes", () => {
  const files = execFileSync("git", ["ls-files"], { encoding: "utf8" }).trim().split("\n");
  const patterns = [
    /\bsk-[A-Za-z0-9_-]{20,}\b/u,
    /\bgh[pousr]_[A-Za-z0-9]{20,}\b/u,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u,
    /api_key:\s+[A-Za-z0-9]{16,}\.[A-Za-z0-9]{8,}/u,
  ];
  for (const file of files) {
    if (!file || file.endsWith(".webp")) continue;
    const content = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    for (const pattern of patterns) assert.doesNotMatch(content, pattern, `${file} contains a secret-shaped value`);
  }
});

test("transient and secret-bearing local files remain ignored", () => {
  const ignore = readFileSync(new URL("../.gitignore", import.meta.url), "utf8");
  for (const pattern of ["hist/", "*.log", ".cache/", ".DS_Store", "Thumbs.db", ".vscode/", ".idea/", ".env", "conf/*.private.yaml"]) {
    assert.ok(ignore.split("\n").includes(pattern), `missing ignore rule: ${pattern}`);
  }
});
