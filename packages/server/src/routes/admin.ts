import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { debugController } from "../controllers/debugController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// 简单的管理认证中间件（生产环境应该使用更安全的认证）
const adminAuth = (req: any, res: any, next: any) => {
  const adminKey = req.headers["x-admin-key"] || req.query.adminKey;

  // 简单的管理密钥验证
  if (adminKey === process.env.ADMIN_KEY || adminKey === "admin123") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "管理权限不足",
    });
  }
};

// 获取所有玩家
router.get("/players", adminAuth, (req, res) =>
  adminController.getAllPlayers(req, res),
);

// 根据邮箱查找玩家
router.get("/player/:email", adminAuth, (req, res) =>
  adminController.getPlayerByEmail(req, res),
);

// 增加玩家资源
router.post("/add-resources", adminAuth, (req, res) =>
  adminController.addPlayerResources(req, res),
);

// 设置玩家资源容量
router.post("/set-capacity", adminAuth, (req, res) =>
  adminController.setPlayerResourceCapacity(req, res),
);

// === Debug功能 (仅开发环境) ===

// 开发环境检查中间件
const checkDevelopmentEnv = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === "production") {
    return res
      .status(403)
      .json({ success: false, message: "Debug功能仅在开发环境下可用" });
  }
  next();
};

// 清空游戏数据（保留账户）
router.post(
  "/debug/clear-game-data",
  authenticateToken,
  checkDevelopmentEnv,
  async (req, res) => {
    await debugController.clearGameData(req, res);
  },
);

// 重置角色数据到初始状态
router.post(
  "/debug/reset-player",
  authenticateToken,
  checkDevelopmentEnv,
  async (req, res) => {
    await debugController.resetPlayer(req, res);
  },
);

export default router;
