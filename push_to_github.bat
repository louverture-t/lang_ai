@echo off
echo ========================================
echo  PUSH TO GITHUB
echo ========================================
echo.

cd /d "C:\Users\d2kol\Documents\ucf_folder\homework_week\capstone\capstone_ucf\lang_ai"

echo Current status:
git status
echo.

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  DONE - Check GitHub Actions for build status
echo  URL: https://github.com/louverture-t/lang_ai/actions
echo ========================================
pause
