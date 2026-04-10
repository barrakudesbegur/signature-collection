#!/bin/bash

git pull
docker compose up -d --build --pull always --remove-orphans
docker system prune -af
