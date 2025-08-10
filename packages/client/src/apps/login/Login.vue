<template>
    <div>
        <LoginForm @switch-to-register="handleSwitchToRegister" @login-success="handleLoginSuccess"></LoginForm>
    </div>
</template>

<script setup lang="ts">
import LoginForm from '../../features/user/features/login/components/LoginForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleSwitchToRegister = () => {
    router.push('/register');
}

const handleLoginSuccess = () => {
    router.push('/');
}

</script>