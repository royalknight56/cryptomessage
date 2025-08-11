<template>
    <div>
        <div>
            {{ player }}
        </div>
        <button @click="handleLogout">退出登录</button>
        <button @click="handleUnregister">注销账号</button>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores";
import type { TopicPayload, User, UserBag } from "@idleworld/types";
import { computed, onMounted } from "vue";
import { LoginApi } from "../../login/api/login-api";
import { useRouter } from "vue-router";

const gameStore = useGameStore();
const router = useRouter();
onMounted(() => {
    gameStore.joinGame(async () => {
        const ret = await gameStore.wsAction<{ user: User }>("join_game", "test");
        if (ret.user) {
            gameStore.player = ret.user;
        }
        gameStore.subscribeTopic("bag", async (data: TopicPayload<{ bag: UserBag }>) => {
            gameStore.setBag(data.payload.bag);
        });
    });
    gameStore.subscribeTopic("system_message", (data: TopicPayload<{ message: string; user: User }>) => {
        console.log("system_message", data);
    });
});
const player = computed(() => gameStore.player);

const handleLogout = () => {
    LoginApi.logout().then((res) => {
        if (res.success) {
            router.push('/login');
        }
    });
}

const handleUnregister = () => {
    LoginApi.unregister().then((res) => {
        if (res.success) {
            router.push('/login');
        }
    });
}
</script>

<style scoped></style>
