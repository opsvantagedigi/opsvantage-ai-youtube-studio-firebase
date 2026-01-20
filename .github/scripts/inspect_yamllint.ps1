# Triggers an empty commit to run workflows and polls GitHub Actions for the
# "YAML Lint" workflow run, printing job and step statuses.

$msg = 'chore(ci): trigger yamllint run'
git commit --allow-empty -m $msg
git push origin HEAD

$u = git remote get-url origin
if ($u -match 'github.com[:/](.+)/(.+?)(\.git)?$') {
    $owner = $matches[1]
    $repo = $matches[2]
} else {
    Write-Error "Could not parse origin URL: $u"
    exit 1
}

Write-Host "Repo: $owner/$repo"

$foundRun = $null
for ($i = 0; $i -lt 24; $i++) {
    Write-Host "Poll attempt $($i+1): fetching runs..."
    $uri = "https://api.github.com/repos/$owner/$repo/actions/runs?per_page=50"
    try {
        $runs = Invoke-RestMethod -Uri $uri -UseBasicParsing -ErrorAction Stop
    } catch {
        Write-Host "Failed to query API: $_"
        Start-Sleep -Seconds 5
        continue
    }

    $candidates = $runs.workflow_runs | Where-Object {
        $_.name -eq 'YAML Lint' -and ($_.head_commit.message -like '*trigger yamllint*' -or ((Get-Date $_.created_at) -gt (Get-Date).AddMinutes(-10)))
    } | Sort-Object created_at -Descending

    if ($candidates -and $candidates.Count -ge 1) {
        $foundRun = $candidates[0]
        Write-Host "Found run: $($foundRun.id) status: $($foundRun.status) conclusion: $($foundRun.conclusion) created_at: $($foundRun.created_at)"
        if ($foundRun.status -eq 'completed') { break }
    } else {
        Write-Host 'No matching YAML Lint run yet.'
    }
    Start-Sleep -Seconds 10
}

if (-not $foundRun) { Write-Host 'No run found within timeout'; exit 2 }

$jobsUri = "https://api.github.com/repos/$owner/$repo/actions/runs/$($foundRun.id)/jobs"
try { $jobs = Invoke-RestMethod -Uri $jobsUri -UseBasicParsing -ErrorAction Stop } catch { Write-Host "Failed to fetch jobs: $_"; exit 3 }

foreach ($job in $jobs.jobs) {
    Write-Host "Job: $($job.name) id:$($job.id) status:$($job.status) conclusion:$($job.conclusion)"
    foreach ($step in $job.steps) {
        Write-Host "  Step: $($step.number) - $($step.name) - conclusion:$($step.conclusion)"
    }
}

Write-Host "Run completed with conclusion: $($foundRun.conclusion)"
