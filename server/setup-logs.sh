#!/bin/bash

#pm2 install pm2-logrotate

pm2 set pm2-logrotate:max_size 10M  # Rotate logs when they exceed 10MB
pm2 set pm2-logrotate:retain 1      # Keep only 1 rotated log file (last 1 day)
pm2 set pm2-logrotate:compress true # Compress rotated logs
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss # Add timestamp to rotated logs