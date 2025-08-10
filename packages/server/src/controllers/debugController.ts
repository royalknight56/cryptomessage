import { Request, Response } from "express";
import { gameService } from "../services/gameService";
import { redisManager } from "../db/redis";

class DebugController {
  // 清空游戏数据（保留账户信息）
  async clearGameData(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "未认证用户" });
      }

      console.log(`[DEBUG] 清空用户 ${userId} 的游戏数据`);

      // 获取玩家ID
      const playerId = await redisManager.getUser(`userId:${userId}`);
      if (playerId) {
        // 删除玩家数据
        await redisManager.deletePlayer(playerId);
        // 删除用户ID映射
        await redisManager.deleteUser(`userId:${userId}`);
        console.log(`[DEBUG] 已删除玩家数据: ${playerId}`);
      }

      res.json({
        success: true,
        message: "游戏数据已清空，账户信息保留",
      });
    } catch (error) {
      console.error("[DEBUG] 清空游戏数据失败:", error);
      res.status(500).json({
        success: false,
        message: "清空游戏数据失败",
      });
    }
  }

  // 重置角色数据到初始状态
  async resetPlayer(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "未认证用户" });
      }

      console.log(`[DEBUG] 重置用户 ${userId} 的角色数据`);

      // 获取现有的玩家
      const player = await gameService.getPlayerByUserId(userId);

      if (player) {
        // 删除现有玩家数据
        await redisManager.deletePlayer(player.id);
        await redisManager.deleteUser(`userId:${userId}`);
        console.log(`[DEBUG] 已删除现有角色: ${player.name}`);
      }

      // 创建新的初始角色
      const newPlayer = await gameService.createPlayerForUser(userId);
      console.log(`[DEBUG] 已创建新角色: ${newPlayer.name}`);

      res.json({
        success: true,
        message: "角色数据已重置为初始状态",
        player: {
          id: newPlayer.id,
          name: newPlayer.name,
          level: newPlayer.level,
        },
      });
    } catch (error) {
      console.error("[DEBUG] 重置角色数据失败:", error);
      res.status(500).json({
        success: false,
        message: "重置角色数据失败",
      });
    }
  }
}

export const debugController = new DebugController();
