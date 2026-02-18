# ============================================
# ZOGAMING - Quick Push Script (PowerShell)
# ============================================
# Usage: .\push.ps1
# Usage with message: .\push.ps1 -m "your message"
# ============================================

param(
    [Alias("m")]
    [string]$Message = "Update: quick push"
)

Write-Host ""
Write-Host "ZOGAMING - Quick Push" -ForegroundColor Cyan
Write-Host ""

git add -A
git commit -m "$Message"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Pushed successfully! Vercel auto-deploying..." -ForegroundColor Green
    Write-Host "Dashboard: https://vercel.com/rifkifahrezi86s-projects/zogaming" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "Push failed!" -ForegroundColor Red
}
