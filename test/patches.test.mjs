import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

const require = createRequire(import.meta.url);
const { applyAdminExecutionPatch } = require("../patches/apply.js");

const targetRelativePath = join("app", "L0", "_all", "mod", "_core", "admin", "views", "agent", "execution.js");

function installFixture() {
  const root = mkdtempSync(join(tmpdir(), "space-agent-patch-"));
  const target = join(root, targetRelativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `
module.exports = function resolveSpace(targetWindow, key) {
      if (key === "space") {
        return targetWindow.space;
      }
};
`);
  assert.equal(applyAdminExecutionPatch(root), true);
  delete require.cache[require.resolve(target)];
  return { resolveSpace: require(target), target };
}

test("patch preserves an existing spaces API while supplying current fallbacks", async () => {
  const { resolveSpace } = installFixture();
  const spaces = { listSpaces: async () => ["existing-space"] };
  const patched = resolveSpace({ space: { spaces } }, "space");

  assert.equal(patched.spaces, spaces);
  await assert.rejects(patched.current.readWidget(), /not available in the Admin context/u);
});

test("patch preserves an existing current API while supplying spaces fallbacks", async () => {
  const { resolveSpace, target } = installFixture();
  const current = { readWidget: async () => "existing-widget" };
  const patched = resolveSpace({ space: { current } }, "space");

  assert.equal(patched.current, current);
  assert.deepEqual(await patched.spaces.listSpaces(), []);
  assert.match(readFileSync(target, "utf8"), /Reflect\.get\(target, prop, receiver\)/u);
});
