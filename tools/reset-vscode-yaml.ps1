Write-Host "Resetting VS Code YAML schema cache and language server..."

# Close VS Code if running
$vsCode = Get-Process -Name "Code" -ErrorAction SilentlyContinue
if ($vsCode) {
	Write-Host "Closing VS Code..."
	$vsCode | Stop-Process -Force
	Start-Sleep -Seconds 2
}

# Paths to clear
$paths = @(
	"$env:APPDATA\Code\User\workspaceStorage",
	"$env:APPDATA\Code\User\globalStorage\redhat.vscode-yaml",
	"$env:APPDATA\Code\User\globalStorage\github.vscode-github-actions",
	"$env:APPDATA\Code\Cache",
	"$env:APPDATA\Code\CachedData"
)

foreach ($p in $paths) {
	if (Test-Path $p) {
		Write-Host "Clearing: $p"
		Remove-Item -Recurse -Force -ErrorAction SilentlyContinue $p
	}
}

Write-Host "Restarting VS Code..."
Start-Process "code" -ArgumentList "."

Write-Host "Done. YAML language server will re-index on startup."

