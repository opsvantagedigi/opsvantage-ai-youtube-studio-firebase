<#
.SYNOPSIS
Installs the Google Cloud SDK (`gcloud`) on Windows using common package managers.

USAGE
./scripts/install-gcloud.ps1
./scripts/install-gcloud.ps1 -Global
#>
param([switch]$Global)

Write-Host "Installing Google Cloud SDK (gcloud)..."

if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "Using Chocolatey to install google-cloud-sdk"
    choco install googlecloudsdk -y
    exit $LASTEXITCODE
}

if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "Using winget to install Google Cloud SDK"
    winget install --id Google.CloudSdk -e --accept-source-agreements --accept-package-agreements
    exit $LASTEXITCODE
}

if (Get-Command scoop -ErrorAction SilentlyContinue) {
    Write-Host "Using Scoop to install gcloud"
    scoop install gcloud
    exit $LASTEXITCODE
}

Write-Host "No supported Windows package manager found (choco/winget/scoop)."
Write-Host "Please follow the official guide: https://cloud.google.com/sdk/docs/install"
exit 1
