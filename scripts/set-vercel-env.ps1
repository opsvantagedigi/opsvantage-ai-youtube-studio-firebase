# Read .env and add each non-empty variable to Vercel production environment if missing
param(
  [string]$EnvFile = ".env",
  [string]$Env = "production",
  [string]$Repo = "ajay-sidals-projects-132aa3d1/ai-youtube-studio"
)

if (-not (Test-Path $EnvFile)) { Write-Host "No .env file found at $EnvFile"; exit 2 }

$existing = & vercel env ls 2>&1 | Out-String
$set = @()
$fail = @()

foreach ($line in Get-Content $EnvFile) {
  $l = $line.Trim()
  if ($l -and -not $l.StartsWith('#')) {
    $idx = $l.IndexOf('=')
    if ($idx -lt 0) { continue }
    $name = $l.Substring(0,$idx).Trim()
    $value = $l.Substring($idx+1)
    if ($null -eq $value) { $value = '' } else { $value = $value.Trim() }
    if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Substring(1,$value.Length-2) }
    if ($value.StartsWith("'") -and $value.EndsWith("'")) { $value = $value.Substring(1,$value.Length-2) }

    if ($existing -match "\b$name\b") { Write-Host "Already present in Vercel: $name"; continue }
    if ($value -eq '') { Write-Host "Skipping empty value for $name"; continue }

    Write-Host "Adding Vercel env: $name"
    # Try to pipe the value into the interactive add command
    try {
      $cmd = "cmd /c echo $value | vercel env add $name $Env --yes"
      Write-Host "Running: $cmd"
      $out = iex $cmd 2>&1
      Write-Host $out
      if ($LASTEXITCODE -eq 0) { $set += $name } else { $fail += $name }
    } catch {
      $err = $_.ToString()
      Write-Host ("Error adding {0}`n{1}" -f $name, $err)
      $fail += $name
    }
  }
}

Write-Host "\nVercel envs added: " ($set -join ', ')
Write-Host "Vercel envs failed: " ($fail -join ', ')
