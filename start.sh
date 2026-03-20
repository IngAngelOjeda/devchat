#!/bin/bash
set -e

docker compose up --build -d

echo ""
echo "devchat running at http://localhost"
echo ""
echo "  stop:    docker compose down"
echo "  logs:    docker compose logs -f"