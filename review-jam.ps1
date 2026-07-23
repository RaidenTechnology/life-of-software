# review-jam.ps1 - Life of Software'i Claude'a surekli GELISTIRT (DONGULU).
# Her tur: oku -> bug bul+DIREKT DUZELT -> yeni fikir ENTEGRE ET ->
#          karakter/oynanis kalite+optimizasyon -> her adimda commit.
# Model zinciri her turda: Fable 5 -> limit dolarsa Opus 4.8.
# Her iki model de limitli/hatali olursa dongu durur.
# Kullanim:  powershell -File review-jam.ps1
# Not: Her tur tam bir Claude oturumu harcar (Max abonelik kotasindan duser).

$proj = Split-Path -Parent $MyInvocation.MyCommand.Path
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$log = Join-Path $proj "review-$stamp.log"

$basePrompt = @'
You are reviewing "Life of Software", a GMTK 2026 jam game (Phaser 3, plain JS,
no build step) in the current directory. Jam rule: NO AI-generated art/audio.
Visuals are Blender-rendered pixel-art PNGs (assets/*.png, built by the scripts
in blender/, hand-modeled — NOT AI) PLUS code-drawn UI; sfx procedural. This is
intentional and owner-approved. DO NOT remove, revert, or "restore code-drawn"
the Blender assets or their BootScene loading / blender/ pipeline — treat them as
first-class art. You MAY improve code that uses them, but keep them in place.

This is an ACTIVE DEVELOPMENT pass, not just a review. You will fix bugs,
implement new features, and improve the game for real - committing after every
step. Do these in order:

1) READ the whole game: index.html, src/*.js, src/scenes/*.js,
   src/data/languages.js, README.md, and the existing NOTES.md (so you do not
   repeat earlier work). Understand the loop: typing patterns vs countdown,
   battle strip, stages, festivals, boss fights, loot/inventory/shop, daily.

2) DEBUG + FIX DIRECTLY: run `node --check` on every js file, then hunt real
   logic bugs: state flags that can deadlock (transitioning/dying/festival/
   bossMode/menuOpen), tween/timer leaks, localStorage edge cases, credits
   overflow, festival+boss interactions, death-save timing, panel/UI overlap at
   960x540. Do not just list them - FIX each bug you find right away. After each
   fix re-run node --check on the touched file and make a SEPARATE git commit.
   Focus on a DIFFERENT area than earlier passes recorded in NOTES.md if possible.

3) IMPLEMENT NEW FEATURES: pick 1-2 FRESH jam-scoped feature ideas (from NOTES.md
   or your own) that raise the jury score, and actually BUILD them this pass -
   do not just write them down. Keep each feature small and self-contained so the
   game stays playable. After each feature: node --check the touched files, play
   through the affected flow in your head to confirm it works, and make a
   SEPARATE git commit. Record what you shipped in NOTES.md.

4) GAMEPLAY QUALITY + OPTIMIZATION: improve the moment-to-moment character/play
   feel (input responsiveness, game-feel, juice, readability, pacing, difficulty
   curve) AND optimize performance (kill tween/timer/object leaks, cut per-frame
   allocations, reuse objects, trim redundant redraws, keep it smooth at 960x540).
   Make concrete edits, not suggestions. node --check + a SEPARATE git commit for
   each improvement.

5) NOTES + SUMMARY: append a section to NOTES.md titled exactly
   "## Auto-dev log - PASS_TAG" summarizing what you fixed, what features you
   shipped, and what quality/perf changes you made this pass, plus any leftover
   ideas for next passes. Commit NOTES.md. Finish with a short report: bugs fixed,
   features shipped, quality/perf changes, commits made.

Hard rules: JAM RULE - no AI-generated art/audio (Blender-rendered PNGs + code UI
are fine and must be preserved), sfx procedural. Never delete files, never rewrite a whole file for
a small edit (use targeted edits), never touch .git config, keep the game
playable at all times and never commit a file that fails node --check. End every
commit message with:
Co-Authored-By: Claude <noreply@anthropic.com>
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

    # bypassPermissions: headless turda node --check ve git commit'in reddedilmemesi icin sart
    # (acceptEdits sadece dosya duzenlemesini onayliyordu, Bash komutlari bloklaniyordu -> hic commit atilamiyordu)
    & claude -p $prompt --model $m.id --permission-mode bypassPermissions --max-turns 100 *>> $log
    $code = $LASTEXITCODE
    $tail = ""
    if (Test-Path $log) { $tail = (Get-Content $log -Tail 40 | Out-String) }
    $limitHit = $tail -match '(?i)(usage limit|rate.?limit|limit (reached|exceeded)|reached your .*limit|out of (usage|quota)|quota|insufficient)'

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
