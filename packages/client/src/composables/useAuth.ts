import { ref } from "vue";
import type {
  User,
  RegisterForm,
  LoginForm,
  AuthResponse,
} from "@idleworld/types";

const API_BASE_URL = "http://localhost:3001/api";

// 全局认证状态
const currentUser = ref<User | null>(null);
const isLoading = ref(false);

export function useAuth() {
  const errors = ref<string[]>([]);

  // 注册
  const register = async (formData: RegisterForm): Promise<AuthResponse> => {
    isLoading.value = true;
    errors.value = [];

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const result: AuthResponse = await response.json();

      if (!result.success && result.errors) {
        errors.value = result.errors;
      }

      return result;
    } catch (error) {
      console.error("注册错误:", error);
      const errorMsg = "网络错误，请检查连接后重试";
      errors.value = [errorMsg];
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // 登录
  const login = async (formData: LoginForm): Promise<AuthResponse> => {
    isLoading.value = true;
    errors.value = [];

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.user) {
        currentUser.value = result.user;
      } else if (result.errors) {
        errors.value = result.errors;
      }

      return result;
    } catch (error) {
      console.error("登录错误:", error);
      const errorMsg = "网络错误，请检查连接后重试";
      errors.value = [errorMsg];
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // 登出
  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("登出错误:", error);
    } finally {
      currentUser.value = null;
    }
  };

  // 获取当前用户信息
  const getCurrentUser = async (): Promise<User | null> => {
    if (currentUser.value) {
      return currentUser.value;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          currentUser.value = result.user;
          return result.user;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error("获取用户信息错误:", error);
    }

    return null;
  };

  // 验证表单
  const validateRegisterForm = (form: RegisterForm): string[] => {
    const validationErrors: string[] = [];

    if (!form.email) {
      validationErrors.push("邮箱不能为空");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.push("请输入有效的邮箱地址");
    }

    if (!form.username) {
      validationErrors.push("用户名不能为空");
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(form.username)) {
      validationErrors.push(
        "用户名必须以英文字母开头，只能包含英文字母、数字和下划线，长度3-20位",
      );
    }

    if (!form.password) {
      validationErrors.push("密码不能为空");
    } else if (form.password.length < 6) {
      validationErrors.push("密码长度至少6位");
    }

    if (form.confirmPassword && form.password !== form.confirmPassword) {
      validationErrors.push("两次输入的密码不一致");
    }

    return validationErrors;
  };

  const validateLoginForm = (form: LoginForm): string[] => {
    const validationErrors: string[] = [];

    if (!form.email) {
      validationErrors.push("邮箱不能为空");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.push("请输入有效的邮箱地址");
    }

    if (!form.password) {
      validationErrors.push("密码不能为空");
    }

    return validationErrors;
  };

  return {
    currentUser,
    isLoading,
    errors,
    register,
    login,
    logout,
    getCurrentUser,
    validateRegisterForm,
    validateLoginForm,
  };
}
