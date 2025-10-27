#!/bin/bash

# CTS Merchant Docker Management Script

echo "🐳 CTS Merchant Docker Management"
echo "================================="

case "$1" in
  "start")
    echo "🚀 Starting CTS Merchant container..."
    docker-compose up -d
    ;;
  "stop")
    echo "🛑 Stopping CTS Merchant container..."
    docker-compose down
    ;;
  "restart")
    echo "🔄 Restarting CTS Merchant container..."
    docker-compose down
    docker-compose up -d
    ;;
  "rebuild")
    echo "🔨 Rebuilding CTS Merchant container..."
    docker-compose down
    docker-compose up --build -d
    ;;
  "logs")
    echo "📄 Showing container logs..."
    docker-compose logs -f
    ;;
  "status")
    echo "📊 Container status:"
    docker-compose ps
    echo ""
    echo "🌐 Application should be available at: http://localhost:8801"
    ;;
  "env-check")
    echo "🔍 Checking environment variables in container..."
    docker exec cts-merchant-app grep -r "soundbox.ctsolution.id" /usr/share/nginx/html/ 2>/dev/null || echo "❌ Environment variables not found in built files"
    ;;
  "shell")
    echo "🐚 Opening shell in container..."
    docker exec -it cts-merchant-app /bin/sh
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|rebuild|logs|status|env-check|shell}"
    echo ""
    echo "Commands:"
    echo "  start     - Start the container"
    echo "  stop      - Stop the container"
    echo "  restart   - Restart the container"
    echo "  rebuild   - Rebuild and restart the container"
    echo "  logs      - Show container logs"
    echo "  status    - Show container status"
    echo "  env-check - Check if environment variables are properly embedded"
    echo "  shell     - Open shell in running container"
    ;;
esac