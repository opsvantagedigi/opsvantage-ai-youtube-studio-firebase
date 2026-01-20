<#
.SYNOPSIS
Installs the Supabase CLI using pnpm or npm on Windows/PowerShell.

USAGE
./scripts/install-supabase.ps1 [-Global]
#>
param([switch]$Global)

Write-Host "Installing Supabase CLI..."
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    if ($Global) {
        pnpm add -g supabase
    } else {
        pnpm add -D supabase -w
    }
    exit $LASTEXITCODE
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm i -g supabase
    exit $LASTEXITCODE
}

Write-Host "Could not find pnpm or npm. Please install Supabase CLI manually: https://supabase.com/docs/reference/cli"
exit 1
