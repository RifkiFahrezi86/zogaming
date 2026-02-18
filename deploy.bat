@echo off
REM ============================================
REM ZOGAMING - Deploy Script (Windows Batch)
REM ============================================
REM Usage: deploy.bat
REM Usage with message: deploy.bat "your commit message"
REM ============================================

SET MESSAGE=%~1
IF "%MESSAGE%"=="" SET MESSAGE=Update: deploy changes

echo.
echo ========================================
echo   ZOGAMING - Auto Deploy to Vercel
echo ========================================
echo.

REM Step 1: Build
echo [1/4] Building project...
call npx next build
IF %ERRORLEVEL% NEQ 0 (
    echo BUILD FAILED!
    exit /b 1
)
echo Build successful!

REM Step 2: Git add
echo [2/4] Staging changes...
git add -A
echo All files staged.

REM Step 3: Git commit
echo [3/4] Committing: %MESSAGE%
git commit -m "%MESSAGE%"

REM Step 4: Git push
echo [4/4] Pushing to GitHub...
git push origin main
IF %ERRORLEVEL% NEQ 0 (
    echo Push failed!
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOYED SUCCESSFULLY!
echo ========================================
echo.
echo Vercel will auto-deploy from GitHub push.
echo Check: https://vercel.com/rifkifahrezi86s-projects/zogaming
echo Site:  https://zogaming.vercel.app
echo.
echo POST-DEPLOY CHECKLIST:
echo   1. Check Vercel dashboard for build status
echo   2. Visit /api/health to check DB connection
echo   3. POST /api/health to auto-create tables (if needed)
echo   4. Test registration at /auth/register
echo.
