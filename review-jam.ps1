# review-jam.ps1 - Life of Software'i Claude'a surekli incelet (DONGULU).
# Her tur: oku -> debug -> kucuk duzeltme + commit -> NOTES.md'ye yeni fikir.
# Model zinciri her turda: Fable 5 -> limit dolarsa Opus 4.8.
# Her iki model de limitli/hatali olursa dongu durur.
# Kullanim:  powershell -File review-jam.ps1
# Not: Her tur tam bir Claude oturumu harcar (Max abonelik kotasindan duser).

$proj = Split-Path -Parent $MyInvocation.MyCommand.Path
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$log = Join-Path $proj "review-$stamp.log"

$basePrompt = @'
You are reviewing "Life of Software", a GMTK 2026 jam game (Phaser 3, plain JS,
no build step) in the current directory. Jam rule: NO AI-generated art/audio -
all visuals are code-drawn, sfx procedural; keep it that way.

Do these in order:

1) READ the whole game: index.html, src/*.js, src/scenes/*.js,
   src/data/languages.js, README.md, and the existing NOTES.md (so you do not
   repeat earlier ideas). Understand the loop: typing patterns vs countdown,
   battle strip, stages, festivals, boss fights, loot/inventory/shop, daily.

2) DEBUG: run `node --check` on every js file. Then hunt real logic bugs:
   state flags that can deadlock (transitioning/dying/festival/bossMode/menuOpen),
   tween/timer leaks, localStorage edge cases, credits overflow, festival+boss
   interactions, death-save timing, panel/UI overlap at 960x540. List each
   suspected bug with file:line and severity. Focus on a DIFFERENT area than
   any earlier pass recorded in NOTES.md if possible.

3) FIX: apply only small, safe fixes (no refactors, no balance changes unless
   clearly broken). After each fix re-run node --check on the touched file and
   make a separate git commit. End every commit message with:
   Co-Authored-By: Claude <noreply@anthropic.com>

4) IDEAS: append a section to NOTES.md titled exactly:
   "## Auto-review ideas - PASS_TAG"
   with 3-5 FRESH jam-scoped ideas not already in NOTES.md (each 2-3 sentences:
   what, why it helps the jury score, rough effort). Do NOT implement them.
   Commit NOTES.md.

5) SUMMARY: finish with a short report: bugs found/fixed, commits made, ideas added.

Hard rules: never delete files, never rewrite whole files for small edits,
never touch .git config, keep the game playable at all times. If you find no new
bugs this pass, say so and still add fresh ideas.
'@

$models = @(
  @{ id = "claude-fable-5";  name = "Fable 5"  },
  @{ id = "claude-opus-4-8"; name = "Opus 4.8" }
)

Set-Location $proj
$pass = 0
$maxPass = 200   # emniyet siniri

Write-Host (">> Dongulu inceleme basladi. Log: " + $log) -ForegroundColor Cyan
Write-Host ">> Durdurmak icin: Ctrl+C" -ForegroundColor DarkGray

while ($pass -lt $maxPass) {
  $pass++
  $passTag = "$stamp pass $pass"
  $prompt = $basePrompt -replace 'PASS_TAG', $passTag
  $ranThisPass = $false

  foreach ($m in $models) {
    Write-Host ""
    Write-Host (">> [Pass $pass] " + $m.name + " ile inceleme...") -ForegroundColor Cyan
    ("`n===== PASS $pass / " + $m.name + " / " + (Get-Date -Format "HH:mm:ss") + " =====") | Out-File -FilePath $log -Append -Encoding utf8

    & claude -p $prompt --model $m.id --permission-mode acceptEdits --max-turns 60 *>> $log
    $code = $LASTEXITCODE
    $tail = ""
    if (Test-Path $log) { $tail = (Get-Content $log -Tail 40 | Out-String) }
    $limitHit = $tail -match '(?i)(usage limit|rate.?limit|limit (reached|exceeded)|out of (usage|quota)|quota|insufficient)'

    if ($code -eq 0 -and -not $limitHit) {
      Write-Host (">> [Pass $pass] " + $m.name + " tamamlandi.") -ForegroundColor Green
      $ranThisPass = $true
      break   # bu turu bitirdik, siradaki modele gecme; disardaki while yeni tur baslatir
    }
    elseif ($limitHit) {
      Write-Host (">> [Pass $pass] " + $m.name + " limiti dolu, siradaki model...") -ForegroundColor Yellow
    }
    else {
      Write-Host (">> [Pass $pass] " + $m.name + " hata (exit $code), siradaki model...") -ForegroundColor Yellow
    }
  }

  if (-not $ranThisPass) {
    Write-Host ""
    Write-Host ">> Tum modeller limitli/hatali - dongu duruldu." -ForegroundColor Red
    break
  }

  Start-Sleep -Seconds 3   # turlar arasi kisa nefes
}

Write-Host ""
Write-Host (">> Toplam " + ($pass) + " tur denendi. Son commitler:") -ForegroundColor Cyan
git log --oneline -12
Write-Host ""
Write-Host (">> Tam rapor: " + $log)
