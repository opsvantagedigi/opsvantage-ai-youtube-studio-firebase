<#
Fetches jobs and steps for a specified workflow run id and prints them cleanly.
Usage:
  $env:GITHUB_TOKEN = '...'
  .\Get-WorkflowJobs.ps1 -Owner 'opsvantagedigi' -Repo 'AI-YouTube-Studio' -RunId 12345
#>
param(
    [Parameter(Mandatory=$true)] [string] $Owner,
    [Parameter(Mandatory=$true)] [string] $Repo,
    [Parameter(Mandatory=$true)] [int] $RunId
)
if (-not $env:GITHUB_TOKEN) {
    Write-Error 'GITHUB_TOKEN environment variable is not set. Set it with $env:GITHUB_TOKEN = "<PAT>"'
    exit 2
}
$headers = @{ Authorization = "Bearer $env:GITHUB_TOKEN" }
$uri = "https://api.github.com/repos/$Owner/$Repo/actions/runs/$RunId/jobs"
try {
    $jobs = Invoke-RestMethod -Uri $uri -Headers $headers -UseBasicParsing -ErrorAction Stop
} catch {
    Write-Error "Failed to fetch jobs: $_"
    exit 3
}
foreach ($job in $jobs.jobs) {
    Write-Host "Job: $($job.name) id:$($job.id) status:$($job.status) conclusion:$($job.conclusion)"
    foreach ($step in $job.steps) {
        Write-Host "  Step: $($step.number) - $($step.name) - conclusion:$($step.conclusion)"
    }
}
