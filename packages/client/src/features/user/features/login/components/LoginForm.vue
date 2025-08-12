<template>
  <div class="login-form">
    <p class="subtitle">登录到你的账户</p>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- 邮箱输入 -->
      <div class="form-group">
        <label for="email">邮箱地址</label>
        <input id="email" v-model="form.email" type="email" placeholder="请输入邮箱地址" :disabled="isLoading"
          class="form-input" :class="{ error: fieldErrors.email }" />
        <span v-if="fieldErrors.email" class="error-text">{{ fieldErrors.email }}</span>
      </div>

      <!-- 密码输入 -->
      <div class="form-group">
        <label for="password">密码</label>
        <input id="password" v-model="form.password" type="password" placeholder="请输入密码" :disabled="isLoading"
          class="form-input" :class="{ error: fieldErrors.password }" />
        <span v-if="fieldErrors.password" class="error-text">{{ fieldErrors.password }}</span>
      </div>

      <!-- 错误信息 -->
      <div v-if="errors.length > 0" class="error-messages">
        <div v-for="error in errors" :key="error" class="error-item">
          {{ error }}
        </div>
      </div>

      <!-- 提交按钮 -->
      <button type="submit" :disabled="isLoading || !isFormValid" class="submit-btn">
        <span v-if="isLoading">登录中...</span>
        <span v-else>登录</span>
      </button>
    </form>

    <!-- 切换到注册 -->
    <div class="switch-form">
      <p>还没有账户？ <button @click="$emit('switch-to-register')" class="link-btn">立即注册</button></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { LoginApi } from '../api/login-api';

// 事件定义
const emits = defineEmits<{
  'switch-to-register': []
  'login-success': []
}>();

// 使用认证组合函数
// const { login, isLoading, errors, validateLoginForm } = useAuth();

const isLoading = ref(false)
// 表单数据
const form = reactive({
  email: '',
  password: ''
});

const errors = ref<string[]>([]);
// 字段错误
const fieldErrors = ref<Record<string, string>>({});

// 表单验证
const isFormValid = computed(() => {
  return form.email &&
    form.password &&
    Object.keys(fieldErrors.value).length === 0;
});


// 提交表单
const handleSubmit = async () => {
  errors.value = [];
  // 清除之前的字段错误
  fieldErrors.value = {};

  // // 验证表单
  // const validationErrors = validateLoginForm(form);
  // if (validationErrors.length > 0) {
  //   // 将错误分配到对应字段
  //   validationErrors.forEach(error => {
  //     if (error.includes('邮箱')) {
  //       fieldErrors.value.email = error;
  //     } else if (error.includes('密码')) {
  //       fieldErrors.value.password = error;
  //     }
  //   });
  //   return;
  // }

  // 提交登录
  const result = await LoginApi.login(form);

  if (result.success) {
    // 触发登录成功事件
    emits('login-success');
  } else {
    console.log(result);
    errors.value = result.errors || [result.message];
  }
};
</script>

<style scoped>
.login-form {
  width: 100%;
}

.login-form h2 {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  text-align: center;
}

.subtitle {
  color: #718096;
  font-size: 16px;
  text-align: center;
  margin: 0 0 32px 0;
  font-weight: 500;
}

.form {
  width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: #f8fafc;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #3182ce;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  transform: translateY(-1px);
}

.form-input.error {
  border-color: #e53e3e;
  background: #fed7d7;
}

.form-input:disabled {
  background: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

.error-text {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 6px;
  display: block;
  font-weight: 500;
}

.error-messages {
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
}

.error-item {
  color: #c53030;
  font-size: 14px;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.2);
  margin-bottom: 24px;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2c5aa0 0%, #2a4d8d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(49, 130, 206, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.switch-form {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.switch-form p {
  color: #718096;
  font-size: 15px;
  margin: 0;
}

.link-btn {
  background: none;
  border: none;
  color: #3182ce;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 0;
}

.link-btn:hover {
  color: #2c5aa0;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-form h2 {
    font-size: 22px;
  }

  .subtitle {
    font-size: 15px;
  }

  .form-input {
    padding: 14px 16px;
    font-size: 16px;
    /* 保持16px防止移动端缩放 */
  }

  .submit-btn {
    padding: 14px 20px;
    font-size: 16px;
  }
}
</style>
