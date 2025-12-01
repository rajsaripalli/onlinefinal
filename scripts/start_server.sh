#!/bin/bash

# Stop existing Node server if running
pkill node || true

# Start backend server
cd /var/www/html/backend
nohup npm start > server.log 2>&1 &

