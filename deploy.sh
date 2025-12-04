#!/bin/bash
cd osa2/puhelinluettelo
npm run build
rm -rf ../osa3/backend/dist
cp -r dist ../osa3/backend/
cd ../..
git add .
git commit -m "update"
git push
