.\pgsql\bin\pg_ctl.exe -D .\pgsql\data -l .\pgsql\logfile start
pause
.\pgsql\bin\pg_ctl.exe -D .\pgsql\data -l .\pgsql\logfile stop
pause