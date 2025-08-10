<template>
    <div>
        <div>
            {{ gold }}
        </div>
        <button @click="handleAddGold">add gold</button>
    </div>
</template>
<script setup lang="ts">
import { useGameStore } from "@/stores";
import type { TopicPayload } from "@idleworld/types";
import { onMounted, onUnmounted, ref } from "vue";

const gameStore = useGameStore();
const gold = ref(0);
onMounted(() => {
    gameStore.subscribeTopic("gold", (data: TopicPayload<{ gold: number }>) => {
        gold.value = data.payload.gold;
    });
});

const handleAddGold = async () => {
    const ret = await gameStore.wsAction<{ gold: number }>('action_add_gold', { gold: 1 });
    console.log("ret", ret);
    gold.value = ret.gold;
}

onUnmounted(() => {
    gameStore.unsubscribeTopic("gold");
});
</script>
