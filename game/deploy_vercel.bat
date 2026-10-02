@echo off
title DEPLOY GAME LEN VERCEL
echo ========================================================
echo   DANG TIEN HANH DEPLOY GAME 'AI LA TRIET HOC GIA'
echo   Len may chu Vercel (Mien phi 100%%, tu dong cap HTTPS)
echo ========================================================
echo.
cd /d "%~dp0\frontend"
echo [1/2] Dang ket noi toi Vercel CLI...
echo Neu day la lan dau tien, trinh duyet se mo ra de ban dang nhap (bang Github / Google).
echo Hay lam theo cac buoc don gian tren man hinh (chon Yes cho moi cau hoi).
echo.
npx vercel --prod
echo.
echo ========================================================
echo   DEPLOY HOAN TAT! HAY COPY DUONG LINK TREN DE CHIA SE!
echo ========================================================
pause
