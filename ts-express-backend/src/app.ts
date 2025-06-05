// 2. This file sets up middleware and routes
import express from 'express';

const app = express();

// Built-in middleware
app.use(express.json());

export default app;
