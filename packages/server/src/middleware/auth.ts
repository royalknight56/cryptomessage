import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";
import { JWTPayload } from "@idleworld/types";

// 认证中间件
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // 从cookie或Authorization header获取token
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "访问令牌缺失",
      });
      return;
    }

    // 验证token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "访问令牌无效",
      });
      return;
    }

    // 将用户信息添加到请求对象
    (
      req as unknown as {
        user: JWTPayload;
      }
    ).user = decoded;
    next();
  } catch (error) {
    console.error("认证中间件错误:", error);
    res.status(500).json({
      success: false,
      message: "认证失败",
    });
    return;
  }
};

// 可选认证中间件（不强制要求登录）
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        (
          req as unknown as {
            user: JWTPayload;
          }
        ).user = decoded;
      }
    }

    next();
  } catch (error) {
    console.error("可选认证中间件错误:", error);
    next();
  }
};
