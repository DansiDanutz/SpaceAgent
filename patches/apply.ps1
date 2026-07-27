# Apply Space Agent core patches
# Run from repo root: .\patches\apply.ps1

$ErrorActionPreference = "Stop"

$SpaceAgentRoot = "$env:LOCALAPPDATA\Programs\space-agent\resources\app"
$PatchDir = "$PSScriptRoot"

if (-not (Test-Path $SpaceAgentRoot)) {
    Write-Error "Space Agent not found at $SpaceAgentRoot"
    exit 1
}

Write-Host "Space Agent found at: $SpaceAgentRoot" -ForegroundColor Green

# Patch 1: Admin execution scope fix
$targetFile = "$SpaceAgentRoot\app\L0\_all\mod\_core\admin\views\agent\execution.js"
$backupFile = "$targetFile.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

if (-not (Test-Path $targetFile)) {
    Write-Error "Target file not found: $targetFile"
    exit 1
}

# Check if already patched
$content = Get-Content $targetFile -Raw
if ($content.Contains('if (target.spaces) return target.spaces') -and $content.Contains('if (target.current) return target.current')) {
    Write-Host "Admin execution patch already applied." -ForegroundColor Yellow
} else {
    Copy-Item $targetFile $backupFile
    Write-Host "Backup created: $backupFile" -ForegroundColor Cyan

    $oldCode = @'
      if (key === "space") {
        return targetWindow.space;
      }
'@

    $newCode = @'
      if (key === "space") {
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
      }
'@

    $legacyCode = $newCode.Replace('Reflect.get(target, prop, receiver)', 'target[prop]')
    $legacyCode = $legacyCode.Replace('get(target, prop, receiver)', 'get(target, prop)')
    $legacyCode = $legacyCode -replace '(?m)^[ \t]*if \(target\.spaces\) return target\.spaces;\r?\n', ''
    $legacyCode = $legacyCode -replace '(?m)^[ \t]*if \(target\.current\) return target\.current;\r?\n', ''

    $codeToReplace = if ($content.Contains($legacyCode)) { $legacyCode } else { $oldCode }

    if ($content.Contains($codeToReplace)) {
        $content = $content.Replace($codeToReplace, $newCode)
        Set-Content $targetFile $content -NoNewline
        Write-Host "Admin execution patch applied successfully." -ForegroundColor Green
    } else {
        Write-Error "Could not find the expected code pattern in $targetFile. The file may have changed."
        exit 1
    }
}

Write-Host "`nAll patches applied. Restart Space Agent for changes to take effect." -ForegroundColor Green
