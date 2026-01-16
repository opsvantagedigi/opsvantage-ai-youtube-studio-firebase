Param(
    [Parameter(Mandatory=$true)] [string]$token,
    [Parameter(Mandatory=$true)] [string]$team
)

$ErrorActionPreference = 'Stop'
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

$body = @{
    name = 'ai-youtube-studio'
    framework = 'nextjs'
    rootDirectory = 'apps/web'
    buildCommand = 'next build'
    outputDirectory = '.next'
    installCommand = 'pnpm install'
    gitRepository = @{
        type = 'github'
        repo = 'opsvantagedigi/AI-YouTube-Studio'
        org = 'opsvantagedigi'
    }
} | ConvertTo-Json -Depth 10

Write-Host "Creating Vercel project 'ai-youtube-studio' in team $team..."
try {
    $proj = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects?teamId=$team" -Method Post -Headers $headers -Body $body
} catch {
    Write-Error "Project creation failed: $($_.Exception.Message)"
    exit 1
}

if (-not $proj -or -not $proj.id) {
    Write-Error "Project creation returned no id. Full response: $($proj | ConvertTo-Json)"
    exit 1
}

$projId = $proj.id
Write-Host "Created project: $($proj.name) ($projId)"

# Import environment variables from .env.local
$envPath = Join-Path (Get-Location) '.env.local'
if (-not (Test-Path $envPath)) {
    Write-Host "Env file not found at $envPath";
} else {
    Write-Host "Importing envs from $envPath..."
    $lines = Get-Content $envPath | Where-Object { $_ -and -not ($_ -match '^\s*#') }
    foreach ($line in $lines) {
        $parts = $line -split '=',2
        if ($parts.Count -lt 2) { Write-Host "Skipping invalid line: $line"; continue }
        $k = $parts[0].Trim()
        $v = $parts[1]
        $envBody = @{
            key = $k
            value = $v
            target = @('production','preview','development')
            type = 'encrypted'
        } | ConvertTo-Json
        try {
            Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$projId/env?teamId=$team" -Method Post -Headers $headers -Body $envBody
            Write-Host "Added env: $k"
        } catch {
            Write-Host "Failed to add env $k: $($_.Exception.Message)"
        }
    }
}

# Add custom domain
$domain = 'studio.opsvantagedigital.online'
$domainBody = @{ name = $domain } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$projId/domains?teamId=$team" -Method Post -Headers $headers -Body $domainBody
    Write-Host "Domain added: $domain"
} catch {
    Write-Host "Domain add failed: $($_.Exception.Message)"
}

# Trigger production deploy using Vercel CLI
Write-Host "Triggering production deploy from apps/web..."
Push-Location (Join-Path (Get-Location).Path "..\apps\web")
try {
    $deployOutput = & npx --yes vercel --token $token --prod --confirm 2>&1
    $deployOutput | ForEach-Object { Write-Host $_ }
} catch {
    Write-Host "Vercel CLI deploy failed: $($_.Exception.Message)"
}
Pop-Location

Write-Host "Script finished. Project ID: $projId"
