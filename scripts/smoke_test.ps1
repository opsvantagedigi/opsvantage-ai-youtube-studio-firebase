try {
  $r = Invoke-WebRequest 'http://localhost:3000/api/workspace/create' -Method POST -Body '{}' -ContentType 'application/json' -UseBasicParsing -TimeoutSec 20
  Write-Output "WORKSPACE-CREATE: $($r.StatusCode)"
  $c = $r.Content
  if ($c.Length -gt 400) { $c = $c.Substring(0,400) }
  Write-Output $c
} catch {
  if ($_.Exception.Response) {
    $code = $_.Exception.Response.StatusCode.Value__
    Write-Output "WORKSPACE-CREATE-FAILED: HTTP $code"
    try {
      $stream = $_.Exception.Response.GetResponseStream()
      $sr = New-Object System.IO.StreamReader($stream)
      $body = $sr.ReadToEnd()
      if ($body) {
        if ($body.Length -gt 400) { $body = $body.Substring(0,400) }
        Write-Output $body
      }
    } catch {}
  } else {
    Write-Output "WORKSPACE-CREATE-FAILED: $($_.Exception.Message)"
  }
}
