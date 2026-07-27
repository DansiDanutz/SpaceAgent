#!/usr/bin/env node
/**
 * Apply Space Agent core patches
 * Run: node patches/apply.js
 */

const fs = require("fs");
const path = require("path");

function defaultSpaceAgentRoot() {
  if (!process.env.LOCALAPPDATA) {
    throw new Error("LOCALAPPDATA is required to locate Space Agent");
  }
  return path.join(process.env.LOCALAPPDATA, "Programs", "space-agent", "resources", "app");
}

function backupFile(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`Backup created: ${backupPath}`);
  return backupPath;
}

function applyAdminExecutionPatch(spaceAgentRoot = defaultSpaceAgentRoot()) {
  const targetFile = path.join(
    spaceAgentRoot,
    "app",
    "L0",
    "_all",
    "mod",
    "_core",
    "admin",
    "views",
    "agent",
    "execution.js"
  );

  if (!fs.existsSync(targetFile)) {
    console.error(`Target file not found: ${targetFile}`);
    return false;
  }

  let content = fs.readFileSync(targetFile, "utf8");

  // Check if already patched
  if (content.includes("!space.spaces") && content.includes("!space.current")) {
    console.log("Admin execution patch already applied.");
    return true;
  }

  const oldCode = `      if (key === "space") {
        return targetWindow.space;
      }`;

  const newCode = `      if (key === "space") {
        const space = targetWindow.space;

        if (space && (!space.spaces || !space.current)) {
          return new Proxy(space, {
            get(target, prop, receiver) {
              if (prop === "spaces") {
                if (target.spaces) return target.spaces;
                return {
                  all: [],
                  byId: {},
                  listSpaces: async () => [],
                  openSpace: async () => {
                    throw new Error("openSpace() is not available in the Admin context.");
                  }
                };
              }

              if (prop === "current") {
                if (target.current) return target.current;
                return {
                  readWidget: async () => {
                    throw new Error("space.current.readWidget() is not available in the Admin context. Use space.api.fileRead() instead.");
                  },
                  seeWidget: async () => {
                    throw new Error("space.current.seeWidget() is not available in the Admin context.");
                  },
                  patchWidget: async () => {
                    throw new Error("space.current.patchWidget() is not available in the Admin context. Use space.api.fileRead() and space.api.fileWrite() instead.");
                  },
                  renderWidget: async () => {
                    throw new Error("space.current.renderWidget() is not available in the Admin context. Use space.api.fileRead() and space.api.fileWrite() instead.");
                  }
                };
              }

              return Reflect.get(target, prop, receiver);
            }
          });
        }

        return space;
      }`;

  if (!content.includes(oldCode)) {
    console.error(`Could not find expected code pattern in ${targetFile}`);
    return false;
  }

  backupFile(targetFile);
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(targetFile, content, "utf8");
  console.log("Admin execution patch applied successfully.");
  return true;
}

function main() {
  const spaceAgentRoot = defaultSpaceAgentRoot();
  if (!fs.existsSync(spaceAgentRoot)) {
    console.error(`Space Agent not found at ${spaceAgentRoot}`);
    process.exit(1);
  }

  console.log(`Space Agent found at: ${spaceAgentRoot}\n`);

  let ok = true;
  ok = applyAdminExecutionPatch(spaceAgentRoot) && ok;

  console.log("\nAll patches applied. Restart Space Agent for changes to take effect.");
  process.exit(ok ? 0 : 1);
}

if (require.main === module) main();

module.exports = { applyAdminExecutionPatch };
