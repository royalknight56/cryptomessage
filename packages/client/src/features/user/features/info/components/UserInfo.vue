<template>
    <div class="user-info">
        <div class="user-info-name">
            {{ player?.username }}
        </div>
        <div class="user-info-name">
            {{ player?.userId }}
        </div>
        <div class="user-info-email">
            {{ player?.email }}
        </div>
        <button class="user-info-logout" @click="handleLogout">退出登录</button>
        <!-- <button class="user-info-unregister" @click="handleUnregister">注销账号</button> -->
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores";
import { computed } from "vue";
import { LoginApi } from "../../login/api/login-api";
import { useRouter } from "vue-router";

const gameStore = useGameStore();
const router = useRouter();

const player = computed(() => gameStore.player);

const handleLogout = () => {
    LoginApi.logout().then((res) => {
        if (res.success) {
            router.push('/login');
        }
    });
}

// const handleUnregister = () => {
//     LoginApi.unregister().then((res) => {
//         if (res.success) {
//             router.push('/login');
//         }
//     });
// }
</script>

<style scoped>
.user-info {
    position: static;
    top: auto;
    left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background: transparent;
    backdrop-filter: none;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    border: none;
    z-index: auto;
    width: 100%;
    max-width: 500px;
}

.user-info-name {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
}

.user-info-email {
    font-size: 16px;
    color: #7f8c8d;
    margin-bottom: 32px;
    font-weight: 400;
}

.user-info-logout,
.user-info-unregister {
    font-size: 16px;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 16px;
    width: auto;
    min-width: 120px;
    font-weight: 600;
}

.user-info-logout {
    background: #3498db;
    color: white;
}

.user-info-logout:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.user-info-unregister {
    background: #e74c3c;
    color: white;
}

.user-info-unregister:hover {
    background: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.user-info-unregister:last-child {
    margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .user-info {
        max-width: 100%;
        padding: 0 20px;
    }

    .user-info-name {
        font-size: 20px;
    }

    .user-info-email {
        font-size: 14px;
        margin-bottom: 24px;
    }

    .user-info-logout,
    .user-info-unregister {
        width: 100%;
        font-size: 14px;
        padding: 10px 20px;
    }
}
</style>
