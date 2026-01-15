param(
  [string]$Domain = 'studio.opsvantagedigital.online',
  [int]$IntervalSeconds = 60,
  [int]$Iterations = 15
)

Write-Host "Monitoring DNS for domain: $Domain"
Write-Host "Checking every $IntervalSeconds seconds for $Iterations iterations"

$vercelNS = @('ns1.vercel-dns.com','ns2.vercel-dns.com')

for ($i=1; $i -le $Iterations; $i++) {
  Write-Host "\n[Check $i of $Iterations]" -ForegroundColor Cyan
  try {
    $ns = Resolve-DnsName $Domain -Type NS -ErrorAction Stop | Select-Object -ExpandProperty NameHost -ErrorAction SilentlyContinue
  } catch {
    $ns = @()
    Write-Host "NS lookup failed or no NS records yet: $($_.Exception.Message)" -ForegroundColor Yellow
  }

  if ($ns) {
    Write-Host "NS records:" -NoNewline; Write-Host " $($ns -join ', ')" -ForegroundColor Green
  } else {
    Write-Host "No NS records returned." -ForegroundColor Yellow
  }

  $matched = $false
  foreach ($entry in $ns) {
    if ($vercelNS -contains $entry.ToLower()) { $matched = $true; break }
  }

  if ($matched) {
    Write-Host "Vercel nameservers detected." -ForegroundColor Green
    try { vercel domains inspect $Domain } catch { Write-Host "Vercel inspect failed: $($_.Exception.Message)" -ForegroundColor Yellow }
    break
  }

  try {
    $a = Resolve-DnsName $Domain -Type A -ErrorAction SilentlyContinue | Select-Object -ExpandProperty IPAddress -ErrorAction SilentlyContinue
    $cname = Resolve-DnsName $Domain -Type CNAME -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameHost -ErrorAction SilentlyContinue
    $txt = Resolve-DnsName $Domain -Type TXT -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Strings -ErrorAction SilentlyContinue
    if ($a) { Write-Host "A records: $($a -join ', ')" -ForegroundColor Green }
    if ($cname) { Write-Host "CNAME: $cname" -ForegroundColor Green }
    if ($txt) { Write-Host "TXT: $($txt -join ' | ')" -ForegroundColor Green }
  } catch {
    Write-Host "Additional DNS lookups failed: $($_.Exception.Message)" -ForegroundColor Yellow
  }

  if ($i -lt $Iterations) { Start-Sleep -Seconds $IntervalSeconds }
}

Write-Host "Monitoring finished."