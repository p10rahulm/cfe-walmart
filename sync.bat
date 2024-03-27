@echo off
REM This file can be run using `sync.bat "commit message"` on Windows.
REM Ensure on Windows that you have permissions for execution.

REM Check if a commit message is provided
if "%~1"=="" (
    set commit_message=updated content  REM Default commit message
) else (
    set commit_message=%~1
)

REM Versioning
git add -A

REM Check if there are changes to commit
git status --porcelain | findstr "^" > nul
if errorlevel 1 (
    echo No changes to commit.
) else (
    git commit -m "%commit_message%"
    git push
    echo Changes successfully committed and pushed.
)

REM Now attempt to directly update website through SSH
REM Ensure local computer's ssh credentials are added to remote machine's ~/.ssh/authorized_keys
ssh -t msrseminar@csacloud.iisc.ac.in -p 3232 "./syncwalmart.sh"
echo "Please check that the website https://www.csa.iisc.ac.in/cfe-walmart/ is updated"
# exit
