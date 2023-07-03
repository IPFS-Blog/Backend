#!/bin/sh
npx typeorm -d /app/dist/src/config/data-source.js migration:show
npx typeorm -d /app/dist/src/config/data-source.js migration:run
node /app/dist/src/main.js