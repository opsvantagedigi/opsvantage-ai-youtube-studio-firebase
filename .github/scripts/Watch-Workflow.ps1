<#
Polls a workflow run until it completes, printing status updates.
Usage:
  $env:GITHUB_TOKEN = '...'
  .\Watch-Workflow.ps1 -Owner 'opsvantagedigi' -Repo 'AI-YouTube-Studio' -RunId 12345 -IntervalSeconds 10 -TimeoutMinutes 15
#>
param(
    [Parameter(Mandatory=$true)] [string] $Owner,
    [Parameter(Mandatory=$true)] [string] $Repo,
    [Parameter(Mandatory=$true)] [int] $RunId,
    [int] $IntervalSeconds = 10,
    [int] $TimeoutMinutes = 15
)
if (-not $env:GITHUB_TOKEN) {
    Write-Error 'GITHUB_TOKEN environment variable is not set. Set it with $env:GITHUB_TOKEN = "<PAT>"'
    exit 2
}
$headers = @{ Authorization = "Bearer $env:GITHUB_TOKEN" }
$end = (Get-Date).AddMinutes($TimeoutMinutes)
while ((Get-Date) -lt $end) {
    $uri = "https://api.github.com/repos/$Owner/$Repo/actions/runs/$RunId"
    $run = Invoke-RestMethod -Uri $uri -Headers $headers -UseBasicParsing
    Write-Host "Run $RunId status: $($run.status) conclusion: $($run.conclusion) updated: $($run.updated_at)"
    if ($run.status -eq 'completed') {
        break
    }
    Start-Sleep -Seconds $IntervalSeconds
}
if ($run.status -ne 'completed') {
    Write-Error "Timeout waiting for run $RunId to complete"
    exit 3
}
Write-Host "Run completed with conclusion: $($run.conclusion)"
