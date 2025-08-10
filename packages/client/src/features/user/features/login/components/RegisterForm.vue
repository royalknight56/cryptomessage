<template>
  <div class="register-form">
    <h2>注册新账户</h2>
    <p class="subtitle">加入放置银河，开始你的星际征程</p>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- 邮箱输入 -->
      <div class="form-group">
        <label for="email">邮箱地址</label>
        <input id="email" v-model="form.email" type="email" placeholder="请输入邮箱地址" :disabled="isLoading"
          class="form-input" :class="{ error: fieldErrors.email }" />
        <span v-if="fieldErrors.email" class="error-text">{{ fieldErrors.email }}</span>
      </div>

      <!-- 用户名输入 -->
      <div class="form-group">
        <label for="username">用户名</label>
        <input id="username" v-model="form.username" type="text" placeholder="请输入用户名（英文字母开头）" :disabled="isLoading"
          class="form-input" :class="{ error: fieldErrors.username }" />
        <span v-if="fieldErrors.username" class="error-text">{{ fieldErrors.username }}</span>
        <small class="help-text">用户名必须以英文字母开头，可包含字母、数字、下划线，3-20位</small>
      </div>

      <!-- 密码输入 -->
      <div class="form-group">
        <label for="password">密码</label>
        <input id="password" v-model="form.password" type="password" placeholder="请输入密码" :disabled="isLoading"
          class="form-input" :class="{ error: fieldErrors.password }" />
        <span v-if="fieldErrors.password" class="error-text">{{ fieldErrors.password }}</span>
      </div>

      <!-- 确认密码输入 -->
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input id="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="请再次输入密码"
          :disabled="isLoading" class="form-input" :class="{ error: fieldErrors.confirmPassword }" />
        <span v-if="fieldErrors.confirmPassword" class="error-text">{{ fieldErrors.confirmPassword }}</span>
      </div>

      <!-- 错误信息 -->
      <!-- <div v-if="errors.length > 0" class="error-messages">
        <div v-for="error in errors" :key="error" class="error-item">
          {{ error }}
        </div>
      </div> -->

      <!-- 提交按钮 -->
      <button type="submit" :disabled="isLoading || !isFormValid" class="submit-btn">
        <span v-if="isLoading">注册中...</span>
        <span v-else>注册账户</span>
      </button>
    </form>

    <!-- 切换到登录 -->
    <div class="switch-form">
      <p>已有账户？ <button @click="$emit('switch-to-login')" class="link-btn">立即登录</button></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { LoginApi } from '../api/login-api';
const isLoading = ref(false);

// 获取emits
const emits = defineEmits<{
  'switch-to-login': []
  'register-success': [username: string]
}>();


// 使用认证组合函数
// const { register, isLoading, errors, validateRegisterForm } = useAuth();

// 表单数据
const form = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
});

// 字段错误
const fieldErrors = ref<Record<string, string>>({});

// 表单验证
const isFormValid = computed(() => {
  return form.email &&
    form.username &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    Object.keys(fieldErrors.value).length === 0;
});

// // 实时验证
// const validateField = (field) => {
//   const tempForm = { ...form };
//   const validationErrors = validateRegisterForm(tempForm);

//   // 清除当前字段的错误
//   delete fieldErrors.value[field];

//   // 检查特定字段的错误
//   validationErrors.forEach(error => {
//     if (field === 'email' && error.includes('邮箱')) {
//       fieldErrors.value.email = error;
//     } else if (field === 'username' && error.includes('用户名')) {
//       fieldErrors.value.username = error;
//     } else if (field === 'password' && error.includes('密码') && !error.includes('一致')) {
//       fieldErrors.value.password = error;
//     } else if (field === 'confirmPassword' && error.includes('一致')) {
//       fieldErrors.value.confirmPassword = error;
//     }
//   });
// };



// 提交表单
const handleSubmit = async () => {
  // 清除之前的字段错误
  fieldErrors.value = {};

  // // 验证表单
  // const validationErrors = validateRegisterForm(form);
  // if (validationErrors.length > 0) {
  //   // 将错误分配到对应字段
  //   validationErrors.forEach(error => {
  //     if (error.includes('邮箱')) {
  //       fieldErrors.value.email = error;
  //     } else if (error.includes('用户名')) {
  //       fieldErrors.value.username = error;
  //     } else if (error.includes('密码') && !error.includes('一致')) {
  //       fieldErrors.value.password = error;
  //     } else if (error.includes('一致')) {
  //       fieldErrors.value.confirmPassword = error;
  //     }
  //   });
  //   return;
  // }

  // 提交注册
  const result = await LoginApi.register({
    username: form.username,
    email: form.email,
    password: form.password
  });

  if (result.success) {
    // 触发注册成功事件
    emits('register-success', form.username);
  }
};


</script>

<style scoped></style>
