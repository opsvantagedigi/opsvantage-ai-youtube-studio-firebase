param(
  [string]$EnvFile = ".env",
  [string]$Repo = "opsvantagedigi/AI-YouTube-Studio"
)

if (-not (Test-Path $EnvFile)) {
  Write-Host "No .env file found at" (Resolve-Path $EnvFile -ErrorAction SilentlyContinue)
  exit 2
}

$set = @()
$fail = @()

foreach ($line in Get-Content $EnvFile) {
  if (-not $line) { continue }
  $l = $line.Trim()
  if ($l -eq "" -or $l.StartsWith('#')) { continue }
  $idx = $line.IndexOf('=')
  if ($idx -lt 0) { continue }
  $name = $line.Substring(0,$idx).Trim()
  $value = $line.Substring($idx+1)
  if ($null -eq $value) { $value = '' } else { $value = $value.Trim() }
  if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Substring(1,$value.Length-2) }
  if ($value.StartsWith("'" ) -and $value.EndsWith("'")) { $value = $value.Substring(1,$value.Length-2) }

  if ($value -ne '') {
    Write-Host "Setting secret: $name"
    gh secret set $name -b $value --repo $Repo
    if ($LASTEXITCODE -eq 0) { Write-Host "✓ Set $name"; $set += $name } else { Write-Host "✗ Failed $name (code $LASTEXITCODE)"; $fail += $name }
  } else {
    Write-Host "Skipping empty value for $name"
  }
}

Write-Host ""
Write-Host "Secrets set: " ($set -join ', ')
Write-Host "Secrets failed: " ($fail -join ', ')
exit 0
