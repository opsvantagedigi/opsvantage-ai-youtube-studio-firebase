<#
Copies selected environment variables from the repo root .env
into apps/web/.env.local in a safe, idempotent way.

Usage (from repo root PowerShell):
  pwsh -ExecutionPolicy Bypass -File .\scripts\sync-root-env-to-web.ps1

The script backs up apps/web/.env.local to apps/web/.env.local.bak.YYYYMMDDHHMMSS
and updates or appends the following keys by default:
  NEXTAUTH_SECRET, NEXTAUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

DO NOT commit the resulting .env.local to git.
#>

[CmdletBinding()]
param(
  [string[]] $Keys = @('NEXTAUTH_SECRET','NEXTAUTH_URL','GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET')
)

Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$rootEnv = Join-Path $repoRoot '.env'
$webEnv = Join-Path $repoRoot 'apps\web\.env.local'

if (-not (Test-Path $rootEnv)) {
  Write-Error "Root .env not found at $rootEnv. Aborting."
  exit 1
}

# Parse root .env into a hashtable (simple KEY=VALUE parser)
$rootLines = Get-Content -Raw -Path $rootEnv -ErrorAction Stop -Encoding UTF8
$kv = @{}
foreach ($line in $rootLines -split "\r?\n") {
  if ($line -match '^\s*#') { continue }
  if ($line -match '^\s*([A-Za-z0-9_]+)=(.*)$') {
    $k = $matches[1]
    $v = $matches[2]
    # Trim surrounding quotes and whitespace
    $v = $v.Trim()
    if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
      $v = $v.Substring(1, $v.Length - 2)
    }
    $kv[$k] = $v
  }
}

if (-not $kv.Keys.Count) {
  Write-Error "No environment variables parsed from $rootEnv. Aborting."
  exit 1
}

if (Test-Path $webEnv) {
  $timestamp = Get-Date -Format yyyyMMddHHmmss
  $backup = "$webEnv.bak.$timestamp"
  Copy-Item -Path $webEnv -Destination $backup -Force
  Write-Output "Backed up existing $webEnv to $backup"
  $webLines = Get-Content -Path $webEnv -ErrorAction SilentlyContinue
} else {
  New-Item -Path $webEnv -ItemType File -Force | Out-Null
  $webLines = @()
  Write-Output "Created new $webEnv"
}

$updated = $false

for ($i = 0; $i -lt $webLines.Count; $i++) {
  foreach ($k in $Keys) {
    if ($webLines[$i] -match "^\s*$k=") {
      if ($kv.ContainsKey($k)) {
        $webLines[$i] = "$k=$($kv[$k])"
        $updated = $true
      }
    }
  }
}

# Append any missing keys from root .env
foreach ($k in $Keys) {
  if ($kv.ContainsKey($k)) {
    $exists = $false
    foreach ($line in $webLines) { if ($line -match "^\s*$k=") { $exists = $true; break } }
    if (-not $exists) {
      $webLines += "$k=$($kv[$k])"
      $updated = $true
    }
  }
}

if ($updated) {
  # Ensure final file ends with a newline
  $out = $webLines -join "`n"
  Set-Content -Path $webEnv -Value $out -Encoding UTF8
  Write-Output "Updated $webEnv with keys: $($Keys -join ', ')"
} else {
  Write-Output "No changes required in $webEnv"
}

Write-Output "Done. Reminder: do NOT commit $webEnv to version control."

# -----------------------------
# OAuth validation checks
# Produces oauth-validation-report.json at repo root
# -----------------------------

Write-Output "Running OAuth validation checks..."

# Load apps/web/.env.local into simple hashtable
$envLocalPath = Join-Path $repoRoot 'apps\web\.env.local'
$envLocal = @{}
if (Test-Path $envLocalPath) {
  foreach ($line in Get-Content -Path $envLocalPath) {
    if ($line -match '^\s*#') { continue }
    if ($line -match '^\s*([A-Za-z0-9_]+)=(.*)$') {
      $k = $matches[1]
      $v = $matches[2].Trim()
      if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
        $v = $v.Substring(1, $v.Length - 2)
      }
      $envLocal[$k] = $v
    }
  }
} else {
  Write-Output "Warning: $envLocalPath not found for validation."
}

$clientId = $envLocal['GOOGLE_CLIENT_ID']
$clientSecret = $envLocal['GOOGLE_CLIENT_SECRET']
$nextAuthUrl = $envLocal['NEXTAUTH_URL']

$expectedRedirects = @()
if ($nextAuthUrl) { $expectedRedirects += "$nextAuthUrl/api/auth/callback/google" }
$expectedRedirects += 'https://ai-youtube-studio.vercel.app/api/auth/callback/google'
$expectedRedirects += 'https://studio.opsvantagedigital.online/api/auth/callback/google'

$report = [ordered]@{
  timestamp = (Get-Date).ToString('o')
  clientIdPresent = -not [string]::IsNullOrWhiteSpace($clientId)
  clientSecretPresent = -not [string]::IsNullOrWhiteSpace($clientSecret)
  clientIdFormatValid = $false
  redirectsValid = $false
  gcloudInstalled = $false
  gcloudClientMatch = $false
  gcloudRedirectsValid = $false
}

if ($report.clientIdPresent) {
  if ($clientId -match '\.apps\.googleusercontent\.com$') { $report.clientIdFormatValid = $true }
}

# Check redirects: we can't call Google API without credentials here, so just ensure expectedRedirects are well-formed
$bad = @()
foreach ($r in $expectedRedirects) { if (-not ($r -match '^https?://')) { $bad += $r } }
$report.redirectsValid = ($bad.Count -eq 0)

# Try gcloud checks if available
if (Get-Command 'gcloud' -ErrorAction SilentlyContinue) {
  $report.gcloudInstalled = $true
  try {
    $json = & gcloud alpha oauth-clients list --format=json 2>$null
    if ($json) {
      $clients = $json | ConvertFrom-Json
      # Try to find a matching client by clientId
      foreach ($c in $clients) {
        if ($c.clientId -eq $clientId -or $c.name -like "*$clientId*") {
          $report.gcloudClientMatch = $true
          $cloudRedirects = @()
          if ($c.redirectUris) { $cloudRedirects = $c.redirectUris }
          $missing = $expectedRedirects | Where-Object { $_ -notin $cloudRedirects }
          $report.gcloudRedirectsValid = ($missing.Count -eq 0)
          break
        }
      }
    }
  } catch {
    # ignore gcloud errors, leave gcloudClientMatch false
  }
}

$reportPath = Join-Path $repoRoot 'oauth-validation-report.json'
$report | ConvertTo-Json -Depth 5 | Out-File -FilePath $reportPath -Encoding UTF8
Write-Output "Wrote OAuth validation report to $reportPath"
