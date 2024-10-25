@echo off
start /min cmd /k "cd /d %USERPROFILE%\Desktop\FBClone && npm start"
start /min cmd /k "ngrok http --url=humane-newt-formally.ngrok-free.app 3000"