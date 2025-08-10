import Joi from "joi";

// 注册验证规则
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "请输入有效的邮箱地址",
    "any.required": "邮箱不能为空",
  }),

  username: Joi.string()
    .pattern(/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/)
    .required()
    .messages({
      "string.pattern.base":
        "用户名必须以英文字母开头，只能包含英文字母、数字和下划线，长度3-20位",
      "any.required": "用户名不能为空",
    }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "密码长度至少6位",
    "string.max": "密码长度不能超过100位",
    "any.required": "密码不能为空",
  }),
});

// 登录验证规则
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "请输入有效的邮箱地址",
    "any.required": "邮箱不能为空",
  }),

  password: Joi.string().required().messages({
    "any.required": "密码不能为空",
  }),
});

// 验证函数
export const validateRegister = (data: any) => {
  const { error, value } = registerSchema.validate(data);
  return {
    isValid: !error,
    errors: error?.details.map((detail) => detail.message) || [],
    data: value,
  };
};

export const validateLogin = (data: any) => {
  const { error, value } = loginSchema.validate(data);
  return {
    isValid: !error,
    errors: error?.details.map((detail) => detail.message) || [],
    data: value,
  };
};
