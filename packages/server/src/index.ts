import { createApp, createSocketServer } from "./app/app";
import { ServerService } from "./app/server";

async function main() {
  // 创建Express应用
  const app = createApp();

  // 创建Socket.IO服务器
  const { server, io } = createSocketServer(app);

  // 创建服务器服务实例并启动
  const serverService = new ServerService(server, io);
  await serverService.start();
}

// 启动应用
main().catch((error) => {
  console.error("启动应用失败:", error);
  // process.exit(1);
});
