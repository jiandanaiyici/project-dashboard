#!/bin/bash

# 聚合平台安装脚本

echo "🚀 开始安装聚合平台..."

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

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 创建环境变量文件
echo "⚙️ 创建环境配置文件..."
cat > .env.local << EOF
# 聚合平台环境配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ID=project-management-platform
VITE_SOURCE_MAP_ENABLED=true
VITE_ENVIRONMENT=development
EOF

echo "✅ 环境配置文件已创建"

# 创建启动脚本
echo "📝 创建启动脚本..."
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 启动聚合平台开发服务器..."
npm run dev
EOF

chmod +x start.sh

echo "✅ 启动脚本已创建"

# 创建构建脚本
echo "📝 创建构建脚本..."
cat > build.sh << 'EOF'
#!/bin/bash
echo "🔨 构建聚合平台生产版本..."
npm run build
EOF

chmod +x build.sh

echo "✅ 构建脚本已创建"

echo ""
echo "🎉 聚合平台安装完成！"
echo ""
echo "📋 可用命令："
echo "  npm run dev     - 启动开发服务器"
echo "  npm run build   - 构建生产版本"
echo "  npm run preview - 预览生产版本"
echo "  npm run lint    - 代码检查"
echo ""
echo "🚀 快速开始："
echo "  ./start.sh      - 启动开发服务器"
echo "  ./build.sh      - 构建生产版本"
echo ""
echo "📖 更多信息请查看 README.md"
