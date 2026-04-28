# Space Agent Core Patches

These patches fix bugs in the installed Space Agent core (L0 firmware) that affect the customware.

## Patches

### `admin-execution-space-api-fix.patch`

**Problem:** In the Admin panel, executing agent code that calls `space.spaces.listSpaces()` or `space.current.readWidget()` throws `TypeError: Cannot read properties of undefined (reading 'listSpaces')`.

**Root cause:** The Admin panel loads its own execution context and does NOT import the spaces dashboard module. Therefore `globalThis.space.spaces` and `globalThis.space.current` are undefined. The admin agent system prompt instructs the LLM to call these APIs, causing a crash on every admin session.

**Fix:** Wrap `targetWindow.space` in a Proxy that provides stub implementations for `spaces` and `current` when they are missing:
- `space.spaces.listSpaces()` → returns `[]`
- `space.spaces.openSpace()` → throws descriptive error
- `space.current.readWidget()` → throws descriptive error suggesting `space.api.fileRead()`
- `space.current.patchWidget()` → throws descriptive error suggesting `space.api.fileRead/Write()`
- `space.current.renderWidget()` → throws descriptive error suggesting `space.api.fileRead/Write()`

## How to Apply

### Option 1: Manual patch (Windows)

1. Locate your Space Agent installation:
   ```
   %LOCALAPPDATA%\Programs\space-agent\resources\app\app\L0\_all\mod\_core\admin\views\agent\execution.js
   ```

2. Find the `createExecutionScope` function (~line 501) and replace:
   ```javascript
   if (key === "space") {
     return targetWindow.space;
   }
   ```
   with the wrapped Proxy version from the patch file.

### Option 2: PowerShell apply script

Run from this repo root:
```powershell
$target = "$env:LOCALAPPDATA\Programs\space-agent\resources\app\app\L0\_all\mod\_core\admin\views\agent\execution.js"
$backup = "$target.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $target $backup

# Apply the patch logic by string replacement
(Get-Content $target -Raw) -replace `
  '      if \(key === "space"\) \{\r?\n        return targetWindow\.space;\r?\n      \}',
  (Get-Content "patches/admin-execution-space-api-fix.patch" -Raw | Select-String '(?s)\+\+\+.*?@@ -498.*?\n(.*?)\n@@' -AllMatches | ForEach-Object { $_.Matches[0].Groups[1].Value }) `
| Set-Content $target -NoNewline
```

### Option 3: Node.js patch script

```bash
node patches/apply.js
```

## Notes

- Core patches are lost when Space Agent is reinstalled or updated.
- After any Space Agent update, re-apply this patch.
- A better long-term fix would be for Space Agent to initialize `space.spaces` and `space.current` in the Admin context, or for the admin system prompt to not reference these APIs.
