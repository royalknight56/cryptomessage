<template>
    <div class="sidebar">
        <div class="sidebar-top">
            <!-- 用户头像和快速信息 -->
            <div class="user-quick-info" @click="toggleUserInfo">
                <div class="user-avatar-large">
                    {{ player?.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
            </div>

            <!-- 导航按钮 -->
            <div class="nav-buttons">
                <div class="nav-button active" @click="setActiveTab('chat')" :class="{ active: activeTab === 'chat' }">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                    <span class="nav-tooltip">聊天</span>
                </div>

                <!-- <div class="nav-button" @click="setActiveTab('contacts')"
                        :class="{ active: activeTab === 'contacts' }">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10l.92 2.92 2.08-2.1v7.18z" />
                        </svg>
                        <span class="nav-tooltip">联系人</span>
                    </div> -->
            </div>
        </div>

        <div class="sidebar-bottom">
            <!-- 设置按钮 -->
            <div class="nav-button" @click="openSettings">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                </svg>
                <span class="nav-tooltip">设置</span>
            </div>

            <!-- 退出按钮 -->
            <div class="nav-button logout-button" @click="handleLogout">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                <span class="nav-tooltip">退出</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { LoginApi } from '@/features/user/features/login/api/login-api';
import { useGameStore } from '@/stores';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// 游戏状态
const gameStore = useGameStore();
const router = useRouter();

// 用户信息
const player = computed(() => gameStore.player);

const props = defineProps<{
    activeTab: string
}>();

const emits = defineEmits<{
    "change-tab": [tab: string]
}>();

// 方法
const toggleUserInfo = () => {

    emits('change-tab', props.activeTab === 'userinfo' ? 'chat' : 'userinfo');
};

const setActiveTab = (tab: string) => {
    emits('change-tab', tab);
};

const openSettings = () => {
    emits('change-tab', 'settings');
};

// const closeSettings = () => {
//     // 这个方法现在不再需要，因为设置在主内容区域
//     activeTab.value = 'chat';
// };

const handleLogout = () => {
    LoginApi.logout().then((res) => {
        if (res.success) {
            router.push('/login');
        }
    });
};

</script>
<style scoped>
/* Sidebar 样式 */
.sidebar {
    width: 70px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 0;
    z-index: 1000;
    border-radius: 20px 0 0 20px;
    margin: 10px 0 10px 10px;
    border-right: none;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.sidebar-top,
.sidebar-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-quick-info {
    margin-bottom: 30px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.user-quick-info:hover {
    transform: scale(1.1);
}

.user-avatar-large {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4a90e2, #007acc);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.nav-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.nav-button {
    position: relative;
    width: 45px;
    height: 45px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-button:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.nav-button.active {
    background: rgba(255, 255, 255, 0.9);
    color: #007acc;
    border-color: rgba(255, 255, 255, 0.3);
}

.nav-button.logout-button:hover {
    background: rgba(231, 76, 60, 0.8);
    color: white;
}

.nav-tooltip {
    position: absolute;
    left: 60px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1001;
}

.nav-button:hover .nav-tooltip {
    opacity: 1;
    visibility: visible;
    left: 65px;
}
</style>
