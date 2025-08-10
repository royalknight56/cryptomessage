<script setup lang="ts">
import RegisterForm from '../../features/user/features/login/components/RegisterForm.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const handleSwitchToLogin = () => {
    router.push('/login');
}
</script>

<template>
    <RegisterForm @register-success="handleSwitchToLogin"></RegisterForm>
</template>
