# 1. Use official Node.js image
FROM node:20

# 2. Set working directory
WORKDIR /app
#├── apps/
#│   └── database-manager/
#│       ├── env/
#│       ├── proto/
#│       ├── sql/
#│       ├── src/
#│       ├── Test/
#│       ├── Dockerfile
#│       ├── package.json
#│       └── tsconfig.json
#├── packages/             # (optional shared packages)
#├── node_modules/         # auto-created
#├── package.json          # root workspace config
#├── tsconfig.base.json    # shared TS config
#└── pnpm-workspace.yaml   # declares `apps/*` as workspac

# 3. Copy only the required files
# copy file pnpm-lock.yaml and pnpm-workspace.yaml inside : 
COPY ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./ 
# copy all the packages inside : 
COPY ../../packages ./packages
# copy the target folder
COPY ../../services/database-manager ./services/database-manager

# 4. Go to database-manager
WORKDIR /app/services/database-manager

RUN cp ./env/.env.docker ./env/.env
# 5. Install only this workspace’s dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --filter database-manager...

# 6. Build TypeScript
RUN pnpm build

# 7. Expose gRPC or other port
EXPOSE 50052

# 8. Start app
CMD ["pnpm", "dev"]