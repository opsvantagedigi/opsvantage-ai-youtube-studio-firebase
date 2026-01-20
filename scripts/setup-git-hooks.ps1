<#
Installs hooks from .githooks/ into .git/hooks/ (creates backups if existing)

Usage:
  pwsh -ExecutionPolicy Bypass -File .\scripts\setup-git-hooks.ps1
#>

Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$src = Join-Path $repoRoot '.githooks\pre-commit'
$dstDir = Join-Path $repoRoot '.git\hooks'
$dst = Join-Path $dstDir 'pre-commit'

if (-not (Test-Path $src)) { Write-Error "Source hook not found: $src"; exit 1 }
if (-not (Test-Path $dstDir)) { Write-Error ".git/hooks directory not found - are you in a git repo?"; exit 1 }

if (Test-Path $dst) {
  $bak = "$dst.bak.$(Get-Date -Format yyyyMMddHHmmss)"
  Copy-Item -Path $dst -Destination $bak -Force
  Write-Output "Backed up existing hook to $bak"
}

Copy-Item -Path $src -Destination $dst -Force
Write-Output "Installed pre-commit hook to $dst"

try { icacls $dst /grant Everyone:RX | Out-Null } catch { }

Write-Output "Done. You can remove hooks by restoring backups if needed."
