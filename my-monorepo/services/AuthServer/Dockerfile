FROM node:20

WORKDIR /app

# Copy everything (from root)
COPY . .

# Set grpc-manager as the working dir for build
WORKDIR /app/grpc-manager

RUN npm install
RUN npm run build

# This is a library, so no CMD needed
