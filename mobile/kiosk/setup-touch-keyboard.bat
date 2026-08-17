@echo off
REM ================================================
REM  Jilio 终端配置：修复触摸软键盘 + 自动弹出
REM  用法：把本文件另存到桌面，右键 -> 以管理员身份运行
REM ================================================

echo [1/2] 启用“触摸键盘和手写面板服务”(TabletInputService)...
sc config TabletInputService start= auto
net start TabletInputService

echo [2/2] 开启“点输入框自动弹出软键盘”...
reg add "HKCU\Software\Microsoft\TabletTip\1.7" /v EnableDesktopModeAutoInvoke /t REG_DWORD /d 1 /f

echo.
echo 完成！请重启电脑。重启后：
echo   - 点任务栏键盘图标可弹出软键盘
echo   - 用手指点输入框会自动弹软键盘（前提：没插物理键盘）
echo.
pause
