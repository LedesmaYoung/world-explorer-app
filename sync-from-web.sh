#!/bin/bash
# 从 world-explorer-web 同步到 world-explorer

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_PROJECT="${SCRIPT_DIR}/../world-explorer-web"
APP_PROJECT="${SCRIPT_DIR}"
WWW_DIR="${APP_PROJECT}/www"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  world-explorer-web → world-explorer${NC}"
echo -e "${BLUE}========================================${NC}"

if [ ! -d "$WEB_PROJECT" ]; then
    echo -e "${RED}错误: 找不到 world-explorer-web 项目${NC}"
    exit 1
fi

mkdir -p "$WWW_DIR"
find "$WWW_DIR" -mindepth 1 -delete

echo -e "${GREEN}同步文件...${NC}"
rsync -av \
    --exclude='manifest.json' \
    --exclude='sw.js' \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.DS_Store' \
    --exclude='*.md' \
    --exclude='start.sh' \
    --exclude='.gitignore' \
    "$WEB_PROJECT/" "$WWW_DIR/"

echo -e "${GREEN}同步 Capacitor...${NC}"
cd "$APP_PROJECT"
npx cap sync ios

echo -e "${GREEN}同步完成！${NC}"
echo -e "${YELLOW}下一步: npx cap open ios${NC}"
