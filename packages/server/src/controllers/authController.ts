import { Request, Response } from "express";
import { validateRegister, validateLogin } from "../utils/validation";
import { authService } from "../services/auth-service";
import { JWTPayload } from "@idleworld/types";

export class AuthController {
  // 用户注册
  async register(req: Request, res: Response): Promise<void> {
    try {
      // 验证输入数据
      const validation = validateRegister(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: "输入数据有误",
          errors: validation.errors,
        });
        return;
      }

      // 调用注册服务
      const result = await authService.register(validation.data);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("注册控制器错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
      });
    }
  }

  // 用户登录
  async login(req: Request, res: Response): Promise<void> {
    try {
      // 验证输入数据
      const validation = validateLogin(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: "输入数据有误",
          errors: validation.errors,
        });
        return;
      }

      // 调用登录服务
      const result = await authService.login(validation.data);

      if (result.success && result.token) {
        // 设置HTTP-only cookie
        res.cookie("token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
        });
      }

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("登录控制器错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
      });
    }
  }

  // 用户登出
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // 清除cookie
      res.clearCookie("token");

      res.status(200).json({
        success: true,
        message: "登出成功",
      });
    } catch (error) {
      console.error("登出控制器错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
      });
    }
  }

  // 获取当前用户信息
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as unknown as { user: JWTPayload }).user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: "未授权",
        });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.userId,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("获取用户信息错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
      });
    }
  }

  // // 注销账号
  // async deleteAccount(req: Request, res: Response): Promise<void> {
  //   try {
  //     const user = (req as any).user;
  //     if (!user) {
  //       res.status(401).json({
  //         success: false,
  //         message: "未授权",
  //       });
  //       return;
  //     }

  //     // 调用注销账号服务
  //     const result = await authService.deleteAccount(user.userId);

  //     if (result.success) {
  //       // 清除cookie
  //       res.clearCookie("token");
  //     }

  //     const statusCode = result.success ? 200 : 400;
  //     res.status(statusCode).json(result);
  //   } catch (error) {
  //     console.error("注销账号控制器错误:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "服务器内部错误",
  //     });
  //   }
  // }
}

export const authController = new AuthController();
