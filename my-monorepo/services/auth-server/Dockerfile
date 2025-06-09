# 1. Use official Node.js image
FROM node:20

# 2. Set working directory at root
WORKDIR /app

# 3. Copy only necessary monorepo files for workspace linking
COPY ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./

# 4. Copy monorepo packages (shared-types, etc.)
COPY ../../packages ./packages

# 5. Copy the RedisManager service folder
COPY ../../services/auth-server ./services/auth-server

# 6. Set working dir to RedisManager
WORKDIR /app/services/auth-server

# 7. Copy and rename the Docker env file (if used)
RUN cp ./env/.env.docker ./env/.env || echo "No .env.docker found"

# 8. Install workspace-aware deps for redis-manager only
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && pnpm install --filter auth-server...

# 9. Build the TypeScript code
RUN pnpm build

# 10. Expose desired gRPC/HTTP port
EXPOSE 50052

# 11. Run dev or start script (you can switch to "start" for prod)
CMD ["pnpm", "dev"]
