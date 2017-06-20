@echo off
title PRUN server
:start
node server.js
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