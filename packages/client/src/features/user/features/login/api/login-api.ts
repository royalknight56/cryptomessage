import apiClient from "../../../../../lib/api-client";

// 登录
export class LoginApi {
  public static async login(formData: { email: string; password: string }) {
    return await apiClient
      .post<{
        success: boolean;
        message: string;
      }>("/auth/login", formData)
      .then((res) => res.data)
      .catch((err) => {
        return {
          success: false,
          message: err.response.data.message,
        };
      });
  }

  public static async register(formData: {
    email: string;
    username: string;
    password: string;
  }) {
    return await apiClient
      .post<{
        success: boolean;
        message: string;
      }>("/auth/register", formData)
      .then((res) => res.data)
      .catch((err) => {
        return {
          success: false,
          message: err.response.data.message,
        };
      });
  }

  public static async logout() {
    return await apiClient
      .post<{
        success: boolean;
        message: string;
      }>("/auth/logout")
      .then((res) => res.data);
  }
}
