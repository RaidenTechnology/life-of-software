# Packages the game into dist/raiden-gmtk2026.zip for itch.io upload.
#
# Compress-Archive is NOT used here on purpose. On Windows PowerShell it writes
# entry names with BACKSLASHES (src\main.js), which itch.io's unzipper treats as
# a literal filename rather than a path -- the game boots to a black screen with
# every script 404ing. That exact failure shipped once already (STAR BREAKER,
# 17 Jul 2026). .NET's ZipArchive lets us write the entry names ourselves, so
# every path goes in with forward slashes.
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$dist = Join-Path $root 'dist'
New-Item -ItemType Directory -Force $dist | Out-Null
$zip = Join-Path $dist 'raiden-gmtk2026.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# index.html must sit at the ZIP ROOT (itch looks for it there), the rest keep
# their relative folders.
$files = @()
$files += Get-Item (Join-Path $root 'index.html')
foreach ($dir in @('lib', 'src', 'assets')) {
  $p = Join-Path $root $dir
  if (Test-Path $p) { $files += Get-ChildItem -Path $p -Recurse -File }
}

$stream = [System.IO.File]::Open($zip, [System.IO.FileMode]::Create)
$archive = New-Object System.IO.Compression.ZipArchive($stream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($f in $files) {
    # relative path from the repo root, forward slashes, no leading separator
    $rel = $f.FullName.Substring($root.Length).TrimStart('\', '/').Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive, $f.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally {
  $archive.Dispose()
  $stream.Dispose()
}

$kb = [math]::Round((Get-Item $zip).Length / 1KB)
Write-Host "OK -> $zip  ($($files.Count) files, $kb KB)"
