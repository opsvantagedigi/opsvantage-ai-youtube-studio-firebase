<#
Enable VS Code shell integration for Windows PowerShell/CMD.
Usage (run in an elevated or regular PowerShell session):
  .\enable-vscode-shell-integration.ps1        # just add VS Code bin to user PATH
  .\enable-vscode-shell-integration.ps1 -InstallExtensions  # also install workspace extensions
#>
param(
    [switch]$InstallExtensions
)

$exts = @(
    'dbaeumer.vscode-eslint',
    'esbenp.prettier-vscode',
    'EditorConfig.EditorConfig',
    'eamodio.gitlens',
    'bradlc.vscode-tailwindcss',
    'ms-azuretools.vscode-docker',
    'christian-kohler.path-intellisense',
    'christian-kohler.npm-intellisense',
    'styled-components.vscode-styled-components'
)

$possibleBins = @(
    "$env:LocalAppData\Programs\Microsoft VS Code\bin",
    "$env:ProgramFiles\Microsoft VS Code\bin",
    "$env:ProgramFiles(x86)\Microsoft VS Code\bin"
)

$found = $possibleBins | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $found) {
    Write-Host "VS Code 'bin' folder not found in standard locations." -ForegroundColor Yellow
    Write-Host "If you have VS Code installed elsewhere, re-run this script with the -BinPath parameter (not implemented)." -ForegroundColor Yellow
    Write-Host "Exiting without changing PATH." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found VS Code bin: $found" -ForegroundColor Green

# Add to user PATH if missing
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notmatch [regex]::Escape($found)) {
    $newPath = if ([string]::IsNullOrEmpty($currentPath)) { $found } else { "$currentPath;$found" }
    [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    Write-Host "Added '$found' to User PATH. Restart any open shells to pick up the change." -ForegroundColor Green
} else {
    Write-Host "User PATH already contains the VS Code bin path." -ForegroundColor Green
}

# Try to call code --version to verify availability in current session
try {
    $codeVersion = & code --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "'code' command is available. version:\n$codeVersion" -ForegroundColor Green
    } else {
        Write-Host "'code' command not available in this session. Re-open PowerShell or sign out/in to load updated PATH." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Unable to run 'code' in the current session. Re-open PowerShell to use the new PATH." -ForegroundColor Yellow
}

if ($InstallExtensions) {
    Write-Host "Installing recommended extensions..." -ForegroundColor Cyan
    # Attempt to install each extension; continue on errors
    foreach ($ext in $exts) {
        Write-Host "Installing $ext ..." -NoNewline
        try {
            & code --install-extension $ext --force 2>$null
            if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " Failed" -ForegroundColor Yellow }
        } catch {
            Write-Host " Failed (exception)" -ForegroundColor Yellow
        }
    }
    Write-Host "Extension install attempted. Run 'code --list-extensions' to verify." -ForegroundColor Cyan
}

Write-Host "Done. If you want me to also attempt to remove Remote-WSL or uninstall WSL, tell me and I'll provide the admin commands." -ForegroundColor Cyan
