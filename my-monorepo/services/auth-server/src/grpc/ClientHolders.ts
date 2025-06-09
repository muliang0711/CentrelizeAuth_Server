// src/grpc/ClientHolder.ts
import type { Client as GrpcClient } from '@grpc/grpc-js';

export class ClientHolder {
  static dbClient: GrpcClient;
  static redisClient: GrpcClient;
}
