import {
  UserEntity,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "@idleworld/types";
import { redisManager } from "../db/redis";
import {
  generateToken,
  generateUserId,
  hashPassword,
  verifyPassword,
} from "../utils/auth";

class AuthService {
  // 用户注册
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      // 检查邮箱是否已存在
      const existingUser = await redisManager.getUserIdByEmail(
        registerData.email,
      );
      if (existingUser) {
        return {
          success: false,
          message: "该邮箱已被注册",
        };
      }

      // 检查用户名是否已存在
      const existingUsername = await redisManager.getUserIdByUsername(
        registerData.username,
      );
      if (existingUsername) {
        return {
          success: false,
          message: "该用户名已被使用",
        };
      }

      // 创建新用户
      const userId = generateUserId();
      const passwordHash = await hashPassword(registerData.password);

      const newUser: UserEntity = {
        userId: userId,
        email: registerData.email.toLowerCase(),
        username: registerData.username,
        passwordHash,
        createdAt: Date.now(),
        isActive: false,
      };

      // 保存用户到Redis（包含完整信息）
      await redisManager.createUser(newUser);

      return {
        success: true,
        message: "注册成功",
        user: {
          userId: newUser.userId,
          email: newUser.email,
          username: newUser.username,
        },
      };
    } catch (error) {
      console.error("注册错误:", error);
      return {
        success: false,
        message: "注册失败，请稍后重试",
      };
    }
  }

  // 用户登录
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      // 获取用户信息
      const user = await redisManager.getUserByEmail(loginData.email);
      if (!user) {
        return {
          success: false,
          message: "邮箱或密码错误",
        };
      }

      // TODO:

      // if (!user.isActive) {
      //   return {
      //     success: false,
      //     message: "账户已被禁用",
      //   };
      // }

      // 验证密码
      const isPasswordValid = await verifyPassword(
        loginData.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: "邮箱或密码错误",
        };
      }

      // 更新最后登录时间
      user.lastLoginAt = Date.now();
      await redisManager.setUser(user.userId, user);

      // 生成JWT token
      const token = generateToken({
        userId: user.userId,
        email: user.email,
        username: user.username,
      });

      return {
        success: true,
        message: "登录成功",
        user: {
          userId: user.userId,
          email: user.email,
          username: user.username,
        },
        token,
      };
    } catch (error) {
      console.error("登录错误:", error);
      return {
        success: false,
        message: "登录失败，请稍后重试",
      };
    }
  }

  // 根据用户ID获取用户
  async getUserById(userId: string): Promise<UserEntity | null> {
    try {
      return await redisManager.getUser(userId);
    } catch (error) {
      console.error("获取用户错误:", error);
      return null;
    }
  }

  // // 注销账号 - 删除用户所有相关数据
  // async deleteAccount(
  //   userId: string,
  // ): Promise<{ success: boolean; message: string }> {
  //   try {
  //     // 获取用户信息
  //     const user = await this.getUserById(userId);
  //     if (!user) {
  //       return {
  //         success: false,
  //         message: "用户不存在",
  //       };
  //     }

  //     // 1. 删除游戏角色数据（如果存在）
  //     try {
  //       const playerId = await redisManager.getUser(`userId:${userId}`);
  //       if (playerId) {
  //         // 删除玩家游戏数据
  //         await redisManager.deletePlayer(playerId);
  //         // 删除用户ID到玩家ID的映射
  //         await redisManager.deleteUser(`userId:${userId}`);

  //         // 删除可能的任务数据
  //         const playerKeys = await redisManager.getKeys(
  //           `mission:${playerId}:*`,
  //         );
  //         for (const key of playerKeys) {
  //           await redisManager.deleteUser(
  //             key.replace("mission:", "").replace(`${playerId}:`, ""),
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       console.error("删除游戏数据错误:", error);
  //       // 继续执行，不阻断账号删除流程
  //     }

  //     // 2. 删除用户认证数据
  //     await redisManager.deleteUser(`user:${user.id}`);
  //     await redisManager.deleteUser(`email:${user.email.toLowerCase()}`);
  //     await redisManager.deleteUser(`username:${user.username}`);

  //     // 3. 删除用户信息
  //     try {
  //       const userInfoKeys = await redisManager.getKeys(`user:${userId}`);
  //       for (const key of userInfoKeys) {
  //         await redisManager.deleteUser(key.replace("user:", ""));
  //       }
  //     } catch (error) {
  //       console.error("删除用户信息错误:", error);
  //     }

  //     // 4. 删除在线状态
  //     await redisManager.deleteUser(`online:${userId}`);

  //     console.log(`用户 ${user.email} (${userId}) 账号已注销`);

  //     return {
  //       success: true,
  //       message: "账号注销成功",
  //     };
  //   } catch (error) {
  //     console.error("注销账号错误:", error);
  //     return {
  //       success: false,
  //       message: "注销账号失败，请稍后重试",
  //     };
  //   }
  // }
}

export const authService = new AuthService();
