import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const authRoutes = Router();

// 用户注册
authRoutes.post("/register", (req, res) => authController.register(req, res));

// 用户登录
authRoutes.post("/login", (req, res) => authController.login(req, res));

// 用户登出
authRoutes.post("/logout", (req, res) => authController.logout(req, res));

// 获取当前用户信息（需要认证）
authRoutes.get("/me", authenticateToken, (req, res) =>
  authController.getCurrentUser(req, res),
);

// // 注销账号（需要认证）
// router.delete("/delete-account", authenticateToken, (req, res) =>
//   authController.deleteAccount(req, res),
// );

export { authRoutes };
