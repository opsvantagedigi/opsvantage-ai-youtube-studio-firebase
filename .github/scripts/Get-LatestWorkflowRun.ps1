<#
Gets the latest workflow run for a given workflow name and prints the run id.
Usage:
  $env:GITHUB_TOKEN = '...'
  .\Get-LatestWorkflowRun.ps1 -Owner 'opsvantagedigi' -Repo 'AI-YouTube-Studio' -WorkflowName 'YAML Lint'
#>
param(
    [Parameter(Mandatory=$true)] [string] $Owner,
    [Parameter(Mandatory=$true)] [string] $Repo,
    [Parameter(Mandatory=$false)] [string] $WorkflowName = 'YAML Lint'
)
if (-not $env:GITHUB_TOKEN) {
    Write-Error 'GITHUB_TOKEN environment variable is not set. Set it with $env:GITHUB_TOKEN = "<PAT>"'
    exit 2
}
$headers = @{ Authorization = "Bearer $env:GITHUB_TOKEN" }
$uri = "https://api.github.com/repos/$Owner/$Repo/actions/runs?per_page=100"
$runs = Invoke-RestMethod -Uri $uri -Headers $headers -UseBasicParsing
$run = $runs.workflow_runs | Where-Object { $_.name -eq $WorkflowName } | Sort-Object created_at -Descending | Select-Object -First 1
if (-not $run) {
    Write-Host "No workflow run found for '$WorkflowName' in $Owner/$Repo"
    exit 1
}
Write-Host "Found run ID: $($run.id) status: $($run.status) conclusion: $($run.conclusion) created_at: $($run.created_at)"
# Print just the id to stdout for piping
Write-Output $run.id
