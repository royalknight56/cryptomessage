// 用户信息

export interface User {
  userId: string;
  email: string;
  username: string;
}

// 完整用户信息（包含服务端需要的敏感信息）
export interface UserEntity extends User {
  passwordHash: string;
  createdAt: number;
  lastLoginAt?: number;
  isActive: boolean;
}

// 注册表单
export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string; // 仅客户端验证使用
}

// 注册请求（发送到服务端）
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// 登录表单
export interface LoginForm {
  email: string;
  password: string;
}

// 登录请求（与LoginForm相同，但语义更明确）
export interface LoginRequest {
  email: string;
  password: string;
}

// 认证响应
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User; // 只返回安全的用户信息
  token?: string;
  errors?: string[]; // 客户端可能需要的错误列表
}

// JWT载荷
export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}
