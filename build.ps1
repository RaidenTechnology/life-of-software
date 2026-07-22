# Packages the game into dist/raiden-gmtk2026.zip for itch.io upload
$root = $PSScriptRoot
$dist = Join-Path $root "dist"
New-Item -ItemType Directory -Force $dist | Out-Null
$zip = Join-Path $dist "raiden-gmtk2026.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $root "index.html"), (Join-Path $root "lib"), (Join-Path $root "src"), (Join-Path $root "assets") -DestinationPath $zip
Write-Host "OK -> $zip"
