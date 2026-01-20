# Encoding validation version: Checks encoding and line endings of reset-vscode-yaml.ps1
$file = "tools/reset-vscode-yaml.ps1"

# Check for BOM
$bytes = [System.IO.File]::ReadAllBytes($file)
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "BOM detected: UTF-8 with BOM."
} else {
    Write-Host "No BOM detected: likely UTF-8 without BOM."
}

# Check for CRLF line endings
$raw = Get-Content $file -Raw
if ($raw -match "\r\n") {
    Write-Host "CRLF line endings detected."
} else {
    Write-Host "LF line endings detected."
}

# Check for non-ASCII characters
if ($raw -match "[^\x00-\x7F]") {
    Write-Host "Non-ASCII characters detected!"
} else {
    Write-Host "All characters are ASCII."
}
