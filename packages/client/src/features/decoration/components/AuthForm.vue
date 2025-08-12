<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <MainLogo />

                <div class="auth-content">
                    <slot></slot>
                </div>
            </div>
            <MainFooter />
        </div>

        <BgCircle />
    </div>
</template>

<script setup lang="ts">
import MainLogo from './MainLogo.vue';
import MainFooter from './MainFooter.vue';
import BgCircle from './BgCircle.vue';
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



.auth-content {
    width: 100%;
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
