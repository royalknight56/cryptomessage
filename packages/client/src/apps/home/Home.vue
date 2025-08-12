<template>
    <div class="home-container">
        <!-- 左侧 Sidebar -->
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
                    <div class="nav-button active" @click="setActiveTab('chat')"
                        :class="{ active: activeTab === 'chat' }">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                        </svg>
                        <span class="nav-tooltip">聊天</span>
                    </div>

                    <div class="nav-button" @click="setActiveTab('contacts')"
                        :class="{ active: activeTab === 'contacts' }">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10l.92 2.92 2.08-2.1v7.18z" />
                        </svg>
                        <span class="nav-tooltip">联系人</span>
                    </div>
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

        <!-- 中间和右侧内容区域 -->
        <div class="main-content">
            <!-- 用户信息面板 -->
            <div v-if="activeTab === 'userinfo'" class="user-info-panel">
                <UserInfo></UserInfo>
            </div>

            <!-- 设置面板 -->
            <div v-else-if="activeTab === 'settings'" class="settings-panel">
                <div class="settings-container">
                    <div class="settings-header">
                        <h2>应用设置</h2>
                        <p class="settings-subtitle">个性化你的使用体验</p>
                    </div>

                    <div class="settings-content">
                        <div class="settings-section">
                            <h3>外观设置</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>主题模式</label>
                                    <span class="setting-desc">选择你喜欢的界面主题</span>
                                </div>
                                <select v-model="theme" class="setting-control">
                                    <option value="light">浅色模式</option>
                                    <option value="dark">深色模式</option>
                                    <option value="auto">跟随系统</option>
                                </select>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>通知设置</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>消息通知</label>
                                    <span class="setting-desc">接收新消息时显示通知</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" v-model="notifications" />
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>

                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>声音提醒</label>
                                    <span class="setting-desc">新消息到达时播放提示音</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" v-model="soundEnabled" />
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>隐私与安全</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <label>自动保存聊天记录</label>
                                    <span class="setting-desc">在本地设备上保存聊天历史</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" v-model="autoSaveChat" />
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="settings-actions">
                            <button class="save-button" @click="saveSettings">保存所有设置</button>
                            <button class="reset-button" @click="resetSettings">恢复默认设置</button>
                            <button class="back-button" @click="setActiveTab('chat')">返回聊天</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 消息组件 (默认页面) -->
            <div v-else class="message-wrapper">
                <Message></Message>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import UserInfo from '@/features/user/features/info/components/UserInfo.vue';
import Message from '@/features/game/features/message/components/Message.vue';
import { useGameStore } from "@/stores";
import { LoginApi } from "@/features/user/features/login/api/login-api";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from 'vue';
import type { TopicPayload, User } from '@idleworld/types';

// 游戏状态
const gameStore = useGameStore();
const router = useRouter();

// 响应式数据
const activeTab = ref('chat');

// 设置相关
const theme = ref('light');
const notifications = ref(true);
const soundEnabled = ref(true);
const autoSaveChat = ref(true);

// 用户信息
const player = computed(() => gameStore.player);


onMounted(() => {
    gameStore.joinGame(async () => {
        const ret = await gameStore.wsAction<{ user: User }>("join_game", "test");
        if (ret.user) {
            gameStore.player = ret.user;
        }
    });
    gameStore.subscribeTopic("system_message", (data: TopicPayload<{ message: string; user: User }>) => {
        console.log("system_message", data);
    });
});



// 方法
const toggleUserInfo = () => {
    activeTab.value = activeTab.value === 'userinfo' ? 'chat' : 'userinfo';
};

const setActiveTab = (tab: string) => {
    activeTab.value = tab;
};

const openSettings = () => {
    activeTab.value = 'settings';
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

const saveSettings = () => {
    // 这里可以添加保存设置到本地存储或服务器的逻辑
    console.log('设置已保存:', {
        theme: theme.value,
        notifications: notifications.value,
        soundEnabled: soundEnabled.value,
        autoSaveChat: autoSaveChat.value
    });
    // 可以添加成功提示
    alert('设置保存成功！');
};

const resetSettings = () => {
    theme.value = 'light';
    notifications.value = true;
    soundEnabled.value = true;
    autoSaveChat.value = true;
    console.log('设置已恢复默认');
    alert('设置已恢复默认值！');
};

</script>

<style scoped>
.home-container {
    height: 100vh;
    display: flex;
    background: linear-gradient(135deg, #cacaca 0%, #fffeff 100%);
    overflow: hidden;
    gap: 0;
}

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

/* 主内容区域 */
.main-content {
    width: calc(100vw - 80px);
    max-width: calc(100vw - 90px);
    flex-shrink: 0;
    display: flex;
    background: white;
    border-radius: 0 20px 20px 0;
    margin: 10px 10px 10px 0;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border-left: none;
    transform: translateX(-1px);
}

.user-info-panel {
    width: 100%;
    padding: 40px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.message-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
}

/* 设置面板样式 */
.settings-panel {
    width: 100%;
    padding: 40px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.settings-container {
    background: white;
    border-radius: 16px;
    padding: 30px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.settings-header {
    text-align: center;
    margin-bottom: 30px;
}

.settings-header h2 {
    margin-bottom: 10px;
    font-size: 28px;
    font-weight: 700;
    color: #333;
}

.settings-subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
}

.settings-content {
    max-height: 600px;
    /* Adjust as needed */
    overflow-y: auto;
}

.settings-section {
    margin-bottom: 30px;
    padding-bottom: 25px;
    border-bottom: 1px solid #f0f0f0;
}

.settings-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.settings-section h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
    margin-bottom: 0;
    border-bottom: none;
}

.setting-info {
    flex: 1;
    margin-right: 20px;
}

.setting-info label {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    display: block;
    margin-bottom: 5px;
}

.setting-desc {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
}

.setting-control {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 150px;
    /* Adjust as needed */
}

.setting-control:focus {
    border-color: #007acc;
}

.toggle-switch {
    position: relative;
    width: 40px;
    height: 20px;
    margin-left: 10px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 20px;
    transition: .4s;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background-color: white;
    transition: .4s;
}

input:checked+.toggle-slider {
    background-color: #007acc;
}

input:focus+.toggle-slider {
    box-shadow: 0 0 1px #007acc;
}

input:checked+.toggle-slider:before {
    transform: translateX(20px);
}

.settings-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-top: 30px;
    padding-top: 25px;
    border-top: 1px solid #f0f0f0;
    flex-wrap: wrap;
}

.save-button,
.reset-button,
.back-button {
    background: #007acc;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 120px;
}

.save-button:hover {
    background: #005a9e;
}

.reset-button {
    background: #e74c3c;
}

.reset-button:hover {
    background: #c0392b;
}

.back-button {
    background: #6c757d;
}

.back-button:hover {
    background: #5a6268;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .sidebar {
        width: 60px;
        padding: 15px 0;
        border-radius: 15px 0 0 15px;
        margin: 5px 0 5px 5px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .user-avatar-large {
        width: 35px;
        height: 35px;
        font-size: 14px;
    }

    .nav-button {
        width: 35px;
        height: 35px;
    }

    .nav-button svg {
        width: 18px;
        height: 18px;
    }

    .main-content {
        width: calc(100vw - 80px);
        margin: 5px 5px 5px 0;
        border-radius: 0 15px 15px 0;
        transform: translateX(-1px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .user-info-panel,
    .settings-panel {
        padding: 20px;
    }

    .settings-container {
        width: 100%;
        margin: 0;
        padding: 20px;
    }

    .settings-header h2 {
        font-size: 24px;
    }

    .settings-subtitle {
        font-size: 14px;
    }

    .settings-section h3 {
        font-size: 18px;
    }

    .setting-item {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 15px;
        padding-bottom: 10px;
    }

    .setting-info {
        margin-right: 0;
        margin-bottom: 10px;
        width: 100%;
    }

    .setting-control {
        width: 100%;
        padding: 8px 12px;
    }

    .toggle-switch {
        width: 30px;
        height: 16px;
        margin-left: 0;
        align-self: flex-end;
    }

    .toggle-slider:before {
        height: 12px;
        width: 12px;
    }

    input:checked+.toggle-slider:before {
        transform: translateX(14px);
    }

    .settings-actions {
        flex-direction: column;
        gap: 12px;
    }

    .save-button,
    .reset-button,
    .back-button {
        width: 100%;
        text-align: center;
        padding: 12px 20px;
        font-size: 16px;
    }
}

/* 滚动条样式 */
.settings-content::-webkit-scrollbar {
    width: 6px;
}

.settings-content::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.settings-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.settings-content::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
