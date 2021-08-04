#!/usr/bin/env bash

echo "Running npm ci"
echo ""
(cd ./NerdFontDataGenerator && npm ci)
echo ""
echo "npm npm ci finished"
echo "Running NerdFontDataGenerator"
echo ""
(cd ./NerdFontDataGenerator && node ./src/index.js)
