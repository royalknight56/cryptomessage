import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWTPayload } from "@idleworld/types";

const JWT_SECRET = process.env.JWT_SECRET || "idlegalaxy_secret_key_2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// 生成JWT token
export const generateToken = (
  payload: Omit<JWTPayload, "iat" | "exp">,
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
};

// 验证JWT token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

// 加密密码
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// 验证密码
export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// 生成随机用户ID
export const generateUserId = (): string => {
  return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};
