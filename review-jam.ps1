# review-jam.ps1 — Life of Software'i Claude'a incelet: fikir + debug + küçük düzeltmeler.
# Model zinciri: Fable 5 → limit dolarsa Opus 4.8 → o da dolarsa durur.
# Kullanım:  powershell -File review-jam.ps1
# Not: Her çalıştırma tam bir Claude oturumu harcar (Max abonelik kotasından düşer).

$proj = Split-Path -Parent $MyInvocation.MyCommand.Path
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$log = Join-Path $proj "review-$stamp.log"

$prompt = @'
You are reviewing "Life of Software", a GMTK 2026 jam game (Phaser 3, plain JS,
no build step) in the current directory. Jam rule: NO AI-generated art/audio —
all visuals are code-drawn, sfx procedural; keep it that way.

Do these in order:

1) READ the whole game: index.html, src/*.js, src/scenes/*.js, src/data/languages.js,
   README.md. Understand the loop: typing patterns vs countdown, battle strip,
   stages, festivals, boss fights, loot/inventory/shop, daily challenge.

2) DEBUG: run `node --check` on every js file. Then hunt real logic bugs:
   state flags that can deadlock (transitioning/dying/festival/bossMode/menuOpen),
   tween/timer leaks, localStorage edge cases, credits overflow, festival+boss
   interactions, death-save timing, panel/UI overlap at 960x540. List each
   suspected bug with file:line and severity.

3) FIX: apply only small, safe fixes (no refactors, no balance changes unless
   clearly broken). After each fix re-run node --check on the touched file and
   make a separate git commit with a clear message.
   End every commit message with:
   Co-Authored-By: Claude <noreply@anthropic.com>

4) IDEAS: append a section "## Auto-review ideas (<today's date>)" to NOTES.md
   with 3-5 fresh, jam-scoped ideas (each 2-3 sentences: what, why it helps the
   jury score, rough effort). Do NOT implement them. Commit NOTES.md.

5) SUMMARY: finish with a short report: bugs found/fixed, commits made, ideas added.

Hard rules: never delete files, never rewrite whole files for small edits,
never touch .git config, keep the game playable at all times.
'@

$models = @(
  @{ id = "claude-fable-5";  name = "Fable 5"  },
  @{ id = "claude-opus-4-8"; name = "Opus 4.8" }
)

Set-Location $proj
$ok = $false

foreach ($m in $models) {
  Write-Host ""
  Write-Host (">> " + $m.name + " ile inceleme basliyor... (log: $log)") -ForegroundColor Cyan

  & claude -p $prompt --model $m.id --permission-mode acceptEdits --max-turns 60 *>> $log
  $code = $LASTEXITCODE
  $tail = ""
  if (Test-Path $log) { $tail = (Get-Content $log -Tail 40 | Out-String) }

  $limitHit = $tail -match '(?i)(usage limit|rate.?limit|limit (reached|exceeded)|out of (usage|quota)|quota)'

  if ($code -eq 0 -and -not $limitHit) {
    Write-Host (">> " + $m.name + " incelemeyi tamamladi.") -ForegroundColor Green
    $ok = $true
    break
  }
  elseif ($limitHit) {
    Write-Host (">> " + $m.name + " limiti dolu gorunuyor, siradaki modele geciliyor...") -ForegroundColor Yellow
  }
  else {
    Write-Host (">> " + $m.name + " hata verdi (exit $code), siradaki model deneniyor...") -ForegroundColor Yellow
  }
}

if (-not $ok) {
  Write-Host ""
  Write-Host ">> Tum modeller limitli/hatali — duruldu. Log: $log" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host ">> Son commitler:" -ForegroundColor Cyan
git log --oneline -8
Write-Host ""
Write-Host ">> Rapor icin log dosyasina bak: $log"
