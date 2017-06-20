@echo off
title PRUN updater
:start
node update.js
echo.
echo.
echo.
echo ---------------
echo ---------------
echo ENDED ON:
date /t
time /t
echo ---------------
echo ---------------
echo.
echo.
echo.
goto start