<template>
  <div class="login-form">
    <h2>登录账户</h2>
    <p class="subtitle">欢迎回到放置银河</p>

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
    errors.value = [result.message];
  }
};
</script>

<style scoped></style>
