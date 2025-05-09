@echo off
setlocal enabledelayedexpansion

echo Deleting all PNG files and specific WebP files ('back', 'overworld', or containing 'gba') recursively...

for /R %%F in (*.png back.webp overworld.webp *gba*.webp) do (
    if exist "%%F" (
        del /Q "%%F"
        echo Deleted: %%F
    )
)

echo Done.
pause