<template>
    <AuthForm>
        <LoginForm @switch-to-register="handleSwitchToRegister" @login-success="handleLoginSuccess">
        </LoginForm>
    </AuthForm>

</template>

<script setup lang="ts">
import LoginForm from '../../features/user/features/login/components/LoginForm.vue';
import { useRouter } from 'vue-router';
import AuthForm from '@/features/decoration/components/AuthForm.vue';

const router = useRouter();

const handleSwitchToRegister = () => {
    router.push('/register');
}

const handleLoginSuccess = () => {
    router.push('/');
}
</script>

<style scoped></style>
