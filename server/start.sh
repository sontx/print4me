#!/bin/bash

# Build the NestJS app
npm run build

# Number of instances to run
INSTANCES=2

# Stop existing instances
pm2 delete ecosystem.config.js

# Start the NestJS app in cluster mode using PM2
pm2 start ecosystem.config.js --instances $INSTANCES --env production

# Save the PM2 process list
pm2 save

# Display PM2 process list
pm2 list

pm2 restart all