<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <div class="logo">
                        <div class="logo-icon">🚀</div>
                        <h1>CryptoMessage</h1>
                    </div>
                    <p class="welcome-text"></p>
                </div>

                <div class="auth-content">
                    <LoginForm @switch-to-register="handleSwitchToRegister" @login-success="handleLoginSuccess">
                    </LoginForm>
                </div>
            </div>

            <div class="auth-footer">
                <p>&copy; 2024 CryptoMessage. 保护您的隐私通讯</p>
            </div>
        </div>

        <!-- 背景装饰 -->
        <div class="bg-decoration">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
        </div>
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

<style scoped>
.auth-page {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #74b9ff 100%);
    position: relative;
    overflow: hidden;
    padding: 20px;
}

.auth-container {
    z-index: 10;
    position: relative;
    width: 100%;
    max-width: 450px;
}

.auth-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 40px;
    box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.1),
        0 8px 40px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-card:hover {
    transform: translateY(-5px);
    box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.15),
        0 12px 50px rgba(0, 0, 0, 0.08);
}

.auth-header {
    text-align: center;
    margin-bottom: 32px;
}

.logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
}

.logo-icon {
    font-size: 48px;
    margin-bottom: 12px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.logo h1 {
    font-size: 28px;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
    letter-spacing: -0.5px;
}

.welcome-text {
    color: #718096;
    font-size: 16px;
    margin: 0;
    font-weight: 500;
}

.auth-content {
    width: 100%;
}

.auth-footer {
    text-align: center;
    margin-top: 24px;
}

.auth-footer p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin: 0;
}

/* 背景装饰 */
.bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;
}

.circle-1 {
    width: 100px;
    height: 100px;
    top: 10%;
    left: 15%;
    animation-delay: 0s;
}

.circle-2 {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 10%;
    animation-delay: 2s;
}

.circle-3 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.6;
    }
}

/* 响应式设计 */
@media (max-width: 480px) {
    .auth-page {
        padding: 10px;
    }

    .auth-card {
        padding: 30px 24px;
        border-radius: 20px;
    }

    .logo h1 {
        font-size: 24px;
    }

    .logo-icon {
        font-size: 40px;
    }

    .welcome-text {
        font-size: 14px;
    }
}
</style>
