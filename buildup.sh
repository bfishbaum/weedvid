#!/bin/bash
rm -rf weedvidio-backend/build
cd weedvidio-frontend
npm run build
wait
cd ..
cp -r weedvidio-frontend/build weedvidio-backend/build
docker build --tag weedvid:latest weedvidio-backend
wait
docker run --publish 80:8000 weedvid:latest