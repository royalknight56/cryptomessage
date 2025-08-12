import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { redisManager } from "../db/redis";
import { handleSocketConnection } from "./socket";
import { logger } from "../utils/logger";

const PORT = process.env.PORT || 3001;

export class ServerService {
  private io: SocketIOServer;
  private server: HttpServer;

  constructor(server: HttpServer, io: SocketIOServer) {
    this.server = server;
    this.io = io;
  }

  async start() {
    try {
      // 连接Redis
      await redisManager.connect();
      logger.info("Redis连接成功");

      // 执行数据迁移
      // console.log("开始执行数据迁移...");

      // 设置Socket.IO连接处理
      this.io.on("connection", (socket) => {
        handleSocketConnection(socket);
      });
      // 启动HTTP服务器
      this.server.listen(PORT, () => {
        logger.info(`服务器运行在端口 ${PORT}`);
      });

      // 设置优雅关闭
      this.setupGracefulShutdown();
    } catch (error) {
      console.error("启动服务器失败:", error);
      // process.exit(1);
    }
  }

  private setupGracefulShutdown() {
    const shutdown = async (signal: string) => {
      console.log(`收到 ${signal} 信号，正在关闭服务器...`);

      try {
        // 关闭HTTP服务器
        this.server.close(() => {
          console.log("HTTP服务器已关闭");
        });

        // 断开Redis连接
        await redisManager.disconnect();
        console.log("Redis连接已断开");

        throw new Error("关闭服务器时出错");
      } catch (error) {
        console.error("关闭服务器时出错:", error);
        throw new Error("关闭服务器时出错");
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  }
}
