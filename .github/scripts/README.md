PowerShell workflow inspection helpers

Usage examples:

1. Set token in session (required):

```powershell
$env:GITHUB_TOKEN = '<PERSONAL_ACCESS_TOKEN>'
```

2. Find latest `YAML Lint` run id:

```powershell
.\.github\scripts\Get-LatestWorkflowRun.ps1 -Owner 'opsvantagedigi' -Repo 'AI-YouTube-Studio' -WorkflowName 'YAML Lint'
```

3. Fetch jobs and steps for a run id:

```powershell
.\.github\scripts\Get-WorkflowJobs.ps1 -Owner 'opsvantagedigi' -Repo 'AI-YouTube-Studio' -RunId 12345
```

4. Poll a run until completion:

```powershell
.\.github\scripts\Watch-Workflow.ps1 -Owner 'opsvantagedigi' -Repo 'AI-YouTube-Studio' -RunId 12345 -IntervalSeconds 10 -TimeoutMinutes 15
```

Notes:

- Token needs `repo` and `workflow` scopes.
- These scripts are safe to run locally and are intended to make it easy to inspect Actions runs and yamllint step results.
