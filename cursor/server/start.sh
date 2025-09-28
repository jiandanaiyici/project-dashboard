#!/bin/bash

# 聚合平台后端服务器启动脚本

echo "🚀 启动聚合平台后端服务器..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node_version=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ 未找到Node.js，请先安装Node.js 16+版本"
    exit 1
fi

echo "✅ Node.js版本: $node_version"

# 检查npm版本
echo "📋 检查npm版本..."
npm_version=$(npm -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ npm版本: $npm_version"

# 检查环境配置文件
if [ ! -f .env ]; then
    echo "⚙️ 创建环境配置文件..."
    cp env.example .env
    echo "✅ 环境配置文件已创建，请根据需要修改 .env 文件"
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p logs
mkdir -p uploads/sourcemaps
echo "✅ 目录创建完成"

# 检查数据库连接
echo "🔍 检查数据库连接..."
node -e "
const { initDatabase } = require('./src/database/connection.js');
initDatabase().then(() => {
  console.log('✅ 数据库连接成功');
  process.exit(0);
}).catch(err => {
  console.log('❌ 数据库连接失败:', err.message);
  console.log('请确保PostgreSQL和Redis服务正在运行');
  process.exit(1);
});
"

if [ $? -ne 0 ]; then
    echo "❌ 数据库连接失败，请检查数据库配置"
    exit 1
fi

# 启动服务器
echo "🚀 启动服务器..."
if [ "$1" = "dev" ]; then
    echo "🔧 开发模式启动..."
    npm run dev
else
    echo "🏭 生产模式启动..."
    npm start
fi

