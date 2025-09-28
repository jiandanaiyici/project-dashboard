#!/bin/bash

echo "🚀 启动聚合平台开发环境..."

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js版本过低，需要18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"

# 检查PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL未安装，将使用SQLite作为替代"
    echo "   建议安装PostgreSQL以获得完整功能"
fi

# 检查Redis
if ! command -v redis-server &> /dev/null; then
    echo "⚠️  Redis未安装，将使用内存存储作为替代"
    echo "   建议安装Redis以获得完整功能"
fi

# 创建必要的目录
mkdir -p uploads/sourcemaps
mkdir -p logs

# 设置环境变量
export NODE_ENV=development
export PORT=3000
export FRONTEND_PORT=5173

# 启动后端服务器
echo "🔧 启动后端服务器..."
cd server
npm run dev-sqlite &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端开发服务器
echo "🎨 启动前端开发服务器..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 聚合平台开发环境启动成功！"
echo ""
echo "📍 访问地址:"
echo "   前端应用: http://localhost:5173"
echo "   后端API:  http://localhost:3000"
echo "   健康检查: http://localhost:3000/health"
echo ""
echo "📊 系统状态:"
echo "   后端进程ID: $BACKEND_PID"
echo "   前端进程ID: $FRONTEND_PID"
echo ""
echo "🛑 停止服务:"
echo "   按 Ctrl+C 停止所有服务"
echo "   或运行: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '✅ 服务已停止'; exit 0" INT

# 保持脚本运行
wait
