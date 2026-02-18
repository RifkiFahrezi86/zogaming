# ============================================
# ZOGAMING - Deploy Script (PowerShell)
# ============================================
# Usage: .\deploy.ps1
# Usage with message: .\deploy.ps1 -m "your commit message"
# ============================================

param(
    [Alias("m")]
    [string]$Message = "Update: deploy changes"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ZOGAMING - Auto Deploy to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build test
Write-Host "[1/4] Building project..." -ForegroundColor Yellow
$buildResult = & npx next build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED!" -ForegroundColor Red
    Write-Host $buildResult
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green

# Step 2: Git add
Write-Host "[2/4] Staging changes..." -ForegroundColor Yellow
git add -A
Write-Host "All files staged." -ForegroundColor Green

# Step 3: Git commit
Write-Host "[3/4] Committing: $Message" -ForegroundColor Yellow
git commit -m "$Message"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nothing to commit or commit failed." -ForegroundColor Yellow
}

# Step 4: Git push
Write-Host "[4/4] Pushing to GitHub (triggers Vercel auto-deploy)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Vercel will auto-deploy from GitHub push." -ForegroundColor Cyan
Write-Host "Check: https://vercel.com/rifkifahrezi86s-projects/zogaming" -ForegroundColor Cyan
Write-Host "Site:  https://zogaming.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "POST-DEPLOY CHECKLIST:" -ForegroundColor Yellow
Write-Host "  1. Check Vercel dashboard for build status"
Write-Host "  2. Visit /api/health to check DB connection"
Write-Host "  3. POST /api/health to auto-create tables (if needed)"
Write-Host "  4. Test registration at /auth/register"
Write-Host ""
