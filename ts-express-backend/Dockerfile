# 1. Use a Node.js base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy all source code
COPY . .

# 5. Build TypeScript to JavaScript
RUN npm run build

# 6. Expose gRPC port
EXPOSE 50051

# 7. Run the built server
CMD ["node", "dist/server.js"]
