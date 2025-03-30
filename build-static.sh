#!/bin/bash

# Build the static version of the site using the special vite config
npx vite build --config vite.config.static.ts

echo "Static build completed!"
echo "The site has been built to the 'dist' directory."