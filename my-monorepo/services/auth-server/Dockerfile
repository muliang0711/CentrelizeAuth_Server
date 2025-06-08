# 1. 使用官方 Node.js 镜像
FROM node:18

# 2. 设置工作目录
WORKDIR /app

# 3. 将项目复制进容器
COPY . .

# 4. 安装 pnpm（如果还没装）
RUN npm install -g pnpm

# 5. 安装所有依赖（包括 workspace 下的 shared-types）
RUN pnpm install

# 6. 编译 shared-types 和 grpc-manager 服务
RUN pnpm --filter @myfirstpackage/shared-types build \
 && pnpm --filter auth-server build

# 7. 启动 gRPC Server
CMD ["pnpm", "--filter", "auth-server", "start"]
