# Hidden character detection version: Prints all non-ASCII and invisible characters in reset-vscode-yaml.ps1
$file = "tools/reset-vscode-yaml.ps1"
$raw = Get-Content $file -Raw

Write-Host "Scanning for hidden/non-ASCII characters..."
for ($i = 0; $i -lt $raw.Length; $i++) {
    $c = $raw[$i]
    $code = [int][char]$c
    if ($code -lt 32 -and $c -ne "`n" -and $c -ne "`r") {
        Write-Host ("Hidden char at pos {0}: 0x{1:X2}" -f $i, $code)
    } elseif ($code -gt 126) {
        Write-Host ("Non-ASCII char at pos {0}: 0x{1:X2}" -f $i, $code)
    }
}
Write-Host "Scan complete."
