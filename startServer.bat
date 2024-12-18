@echo off
start "SocialClone Server" /min cmd /C "cd /d %USERPROFILE%\Desktop\SocialClone && npm start"
start "Ngrok Server" /min cmd /C "ngrok http --url=humane-newt-formally.ngrok-free.app 3000"