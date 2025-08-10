import { Request, Response } from "express";
import { gameService } from "../services/gameService";

export class AdminController {
  // 获取所有玩家列表
  async getAllPlayers(req: Request, res: Response): Promise<void> {
    try {
      const players = await gameService.getAllPlayers();

      // 获取玩家对应的用户邮箱
      const playersWithEmail = await Promise.all(
        players.map(async (player) => {
          try {
            // 通过userId映射找到用户ID，然后获取用户信息
            const userIdKeys = await import("../db/redis").then((m) =>
              m.redisManager.getKeys("userId:*"),
            );

            for (const userIdKey of userIdKeys) {
              const playerId = await import("../db/redis").then((m) =>
                m.redisManager.getUser(userIdKey),
              );
              if (playerId === player.id) {
                // 从键中提取用户ID
                const userId = userIdKey.replace("userId:", "");
                const userData = await import("../db/redis").then((m) =>
                  m.redisManager.getUserInfo(userId),
                );
                if (userData) {
                  return { ...player, email: userData.email };
                }
              }
            }

            return { ...player, email: "unknown" };
          } catch (error) {
            console.error("获取玩家邮箱错误:", error);
            return { ...player, email: "error" };
          }
        }),
      );

      res.status(200).json({
        success: true,
        players: playersWithEmail,
      });
    } catch (error) {
      console.error("获取所有玩家错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  }

  // 根据邮箱查找玩家
  async getPlayerByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      if (!email) {
        res.status(400).json({
          success: false,
          message: "邮箱参数缺失",
        });
        return;
      }

      const decodedEmail = decodeURIComponent(email);
      console.log(`管理面板查找玩家: ${decodedEmail}`);

      const player = await gameService.getPlayerByEmail(decodedEmail);

      if (!player) {
        console.log(`未找到邮箱为 ${decodedEmail} 的玩家`);
        res.status(404).json({
          success: false,
          message: "未找到该邮箱对应的玩家",
        });
        return;
      }

      console.log(`找到玩家: ${player.name}, ID: ${player.id}`);
      res.status(200).json({
        success: true,
        player: { ...player, email: decodedEmail },
      });
    } catch (error) {
      console.error("根据邮箱查找玩家错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  }

  // 增加玩家资源
  async addPlayerResources(req: Request, res: Response): Promise<void> {
    try {
      const { email, resources } = req.body;

      if (!email || !resources) {
        res.status(400).json({
          success: false,
          message: "邮箱或资源参数缺失",
        });
        return;
      }

      // 验证资源格式
      const validResources: { [key: string]: number } = {};
      if (
        resources.ore !== undefined &&
        typeof resources.ore === "number" &&
        resources.ore >= 0
      ) {
        validResources.ore = resources.ore;
      }
      if (
        resources.energy !== undefined &&
        typeof resources.energy === "number" &&
        resources.energy >= 0
      ) {
        validResources.energy = resources.energy;
      }
      if (
        resources.rare !== undefined &&
        typeof resources.rare === "number" &&
        resources.rare >= 0
      ) {
        validResources.rare = resources.rare;
      }

      if (Object.keys(validResources).length === 0) {
        res.status(400).json({
          success: false,
          message: "无效的资源数据",
        });
        return;
      }

      // 根据邮箱查找玩家
      const player = await gameService.getPlayerByEmail(email);
      if (!player) {
        res.status(404).json({
          success: false,
          message: "未找到该邮箱对应的玩家",
        });
        return;
      }

      // 增加资源
      const result = await gameService.addPlayerResources(
        player.id,
        validResources,
      );

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("增加玩家资源错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  }

  // 设置玩家资源容量
  async setPlayerResourceCapacity(req: Request, res: Response): Promise<void> {
    try {
      const { email, capacity } = req.body;

      if (!email || !capacity) {
        res.status(400).json({
          success: false,
          message: "邮箱或容量参数缺失",
        });
        return;
      }

      // 验证容量格式
      const validCapacity: { [key: string]: number } = {};
      if (
        capacity.ore !== undefined &&
        typeof capacity.ore === "number" &&
        capacity.ore > 0
      ) {
        validCapacity.ore = capacity.ore;
      }
      if (
        capacity.energy !== undefined &&
        typeof capacity.energy === "number" &&
        capacity.energy > 0
      ) {
        validCapacity.energy = capacity.energy;
      }
      if (
        capacity.rare !== undefined &&
        typeof capacity.rare === "number" &&
        capacity.rare > 0
      ) {
        validCapacity.rare = capacity.rare;
      }

      if (Object.keys(validCapacity).length === 0) {
        res.status(400).json({
          success: false,
          message: "无效的容量数据",
        });
        return;
      }

      // 根据邮箱查找玩家
      const player = await gameService.getPlayerByEmail(email);
      if (!player) {
        res.status(404).json({
          success: false,
          message: "未找到该邮箱对应的玩家",
        });
        return;
      }

      // 设置资源容量
      const result = await gameService.setPlayerResourceCapacity(
        player.id,
        validCapacity,
      );

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("设置玩家资源容量错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  }
}

export const adminController = new AdminController();
