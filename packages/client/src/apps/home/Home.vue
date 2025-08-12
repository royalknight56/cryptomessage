<template>
    <div class="home-container">
        <!-- 左侧 Sidebar -->

        <SideBar :activeTab="activeTab" @change-tab="handleChangeTab"></SideBar>
        <!-- 中间和右侧内容区域 -->
        <div class="main-content">
            <!-- 用户信息面板 -->
            <div v-show="activeTab === 'userinfo'" class="panel">
                <UserInfo></UserInfo>
            </div>

            <!-- 设置面板 -->
            <div v-show="activeTab === 'settings'" class="panel">
                <UserSetting></UserSetting>
            </div>

            <!-- 消息组件 (默认页面) -->
            <div v-show="activeTab === 'chat'" class="panel">
                <Message></Message>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import UserInfo from '@/features/user/features/info/components/UserInfo.vue';
import Message from '@/features/game/features/message/components/Message.vue';
import { useGameStore } from "@/stores";
import { ref, onMounted } from 'vue';
import type { TopicPayload, User } from '@idleworld/types';
import UserSetting from '@/features/game/features/setting/components/UserSetting.vue';
import SideBar from '@/features/game/components/SideBar.vue';

// 游戏状态
const gameStore = useGameStore();


// 响应式数据
const activeTab = ref('chat');

const handleChangeTab = (tab: string) => {
    activeTab.value = tab;
}

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




</script>

<style scoped>
.home-container {
    height: 100vh;
    display: flex;
    background: linear-gradient(135deg, #cacaca 0%, #fffeff 100%);
    overflow: hidden;
    gap: 0;
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

.panel {
    width: 100%;
    /* padding: 40px; */
    display: flex;
    /* align-items: flex-start; */
    /* justify-content: center; */
    /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
}
</style>
