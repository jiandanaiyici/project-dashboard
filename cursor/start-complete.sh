#!/bin/bash

# 聚合平台完整系统启动脚本

echo "🚀 启动聚合平台完整系统..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

echo "✅ Docker环境检查通过"

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p nginx/ssl
mkdir -p server/logs
mkdir -p server/uploads/sourcemaps
echo "✅ 目录创建完成"

# 检查环境配置文件
if [ ! -f server/.env ]; then
    echo "⚙️ 创建后端环境配置文件..."
    cp server/env.example server/.env
    echo "✅ 后端环境配置文件已创建"
fi

# 构建和启动服务
echo "🔨 构建和启动Docker服务..."
docker-compose up --build -d

if [ $? -ne 0 ]; then
    echo "❌ Docker服务启动失败"
    exit 1
fi

echo "✅ Docker服务启动成功"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."

# 检查PostgreSQL
echo "检查PostgreSQL..."
if docker-compose exec postgres pg_isready -U postgres; then
    echo "✅ PostgreSQL运行正常"
else
    echo "❌ PostgreSQL启动失败"
fi

# 检查Redis
echo "检查Redis..."
if docker-compose exec redis redis-cli ping | grep -q PONG; then
    echo "✅ Redis运行正常"
else
    echo "❌ Redis启动失败"
fi

# 检查后端API
echo "检查后端API..."
if curl -s http://localhost:3000/health | grep -q "ok"; then
    echo "✅ 后端API运行正常"
else
    echo "❌ 后端API启动失败"
fi

# 检查前端
echo "检查前端..."
if curl -s http://localhost:5173 | grep -q "html"; then
    echo "✅ 前端应用运行正常"
else
    echo "❌ 前端应用启动失败"
fi

# 检查Nginx
echo "检查Nginx..."
if curl -s http://localhost | grep -q "html"; then
    echo "✅ Nginx代理运行正常"
else
    echo "❌ Nginx代理启动失败"
fi

echo ""
echo "🎉 聚合平台完整系统启动完成！"
echo ""
echo "📋 服务访问地址："
echo "  🌐 前端应用: http://localhost"
echo "  🔧 后端API: http://localhost:3000"
echo "  📊 健康检查: http://localhost:3000/health"
echo "  🗄️  PostgreSQL: localhost:5432"
echo "  🔴 Redis: localhost:6379"
echo ""
echo "📋 管理命令："
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo "  查看状态: docker-compose ps"
echo ""
echo "📖 更多信息请查看 README.md"
