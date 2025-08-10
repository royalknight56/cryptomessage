<template>
    <div>
        <div v-for="battle in battleHistory" :key="battle?.id">
            <div>{{ battle?.id }}</div>
            <div>{{ battle?.result }}</div>
            <div>{{ battle?.endTime }}</div>
            <div>{{ battle?.rounds.length }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useGameStore } from "@/stores";
import type { Battle, TopicPayload } from "@idleworld/types";

const gameStore = useGameStore();

const battleHistory = ref<(Battle | null)[]>([]);

onMounted(() => {
    gameStore.wsAction("action_get_battle_history", {});
    gameStore.subscribeTopic("battle_history", (data: TopicPayload<{
        battleHistory: (Battle | null)[];
    }>) => {
        battleHistory.value = data.payload.battleHistory;
    });
});
onUnmounted(() => {
    gameStore.unsubscribeTopic("battle_history");
});
</script>
