<template>
    <div>
        <div>Group</div>
        <div>
            {{ group }}
        </div>
        <button @click="joinGroup">Join Group</button>
        <button @click="leaveGroup">Leave Group</button>
    </div>
</template>
<script setup lang="ts">
import { useGameStore } from "@/stores";
import type { TopicPayload } from "@idleworld/types";
import { onMounted, onUnmounted, ref } from "vue";

const gameStore = useGameStore();

const group = ref({
    id: "1",
    name: "group1",
    description: "group1",
    members: [] as string[],
});

onMounted(() => {
    gameStore.subscribeTopic("group", (data: TopicPayload<{ group: { id: string; name: string; description: string; members: string[] } }>) => {
        group.value = data.payload.group;
    });
});

onUnmounted(() => {
    gameStore.unsubscribeTopic("group");
});

const joinGroup = () => {
    gameStore.wsAction("action_group_join", {});

};

const leaveGroup = () => {
    gameStore.wsAction("action_group_leave", {});
};
</script>
