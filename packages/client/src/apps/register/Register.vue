<script setup lang="ts">
import RegisterForm from '../../features/user/features/login/components/RegisterForm.vue';
import { useRouter } from 'vue-router';
import AuthForm from '@/features/decoration/components/AuthForm.vue';
const router = useRouter();

const handleSwitchToLogin = () => {
    router.push('/login');
}
</script>

<template>
    <AuthForm>
        <RegisterForm @register-success="handleSwitchToLogin" @switch-to-login="handleSwitchToLogin">
        </RegisterForm>
    </AuthForm>
</template>
