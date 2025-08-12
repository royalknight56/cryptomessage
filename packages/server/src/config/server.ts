import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "../routes/auth";
// import authRoutes from '../routes/auth';
// import adminRoutes from '../routes/admin';

export function createApp() {
  const app = express();

  // 中间件配置
  app.use(
    cors({
      origin: [
        "https://cmes.vtron.site",
        "http://cmes.vtron.site",
        "http://localhost:5173",
      ],
      credentials: true,
      methods: ["GET", "POST", "OPTIONS", "PATCH"],
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  // 路由配置
  app.use("/api/auth", authRoutes);
  // app.use('/api/admin', adminRoutes);

  return app;
}

export function createSocketServer(app: express.Application) {
  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: [
        "https://cmes.vtron.site",
        "http://cmes.vtron.site",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST", "OPTIONS", "PATCH"],
      credentials: true,
    },
  });

  return { server, io };
}
