<template>
    <div>
        <div v-if="battle">
            <div>
                {{ battle.fromUserId }} vs {{ battle.toUserId }}
            </div>
            <div>
                {{ battle.status }}
            </div>
            <div>
                <div v-for="round in battle.rounds"
                    :key="round.fromUserId + round.toUserId + round.skill + round.damage">
                    {{ round.fromUserId }} {{ round.toUserId }} {{ round.skill }} {{ round.damage }}
                </div>
            </div>
        </div>
        <div v-else>
            <div>
                No battle found
            </div>
        </div>
        <button @click="startBattle">Start Battle</button>
        <button @click="actionBattle">Action Battle</button>
    </div>
</template>
<script setup lang="ts">
import { useGameStore } from "@/stores";
import type { Battle, TopicPayload } from "@idleworld/types";
import { onMounted, onUnmounted, ref } from "vue";

const gameStore = useGameStore();
const battle = ref<Battle | null>(null);
onMounted(() => {
    gameStore.subscribeTopic("battle", (data: TopicPayload<Battle>) => {
        battle.value = data.payload;
    });
});

onUnmounted(() => {
    gameStore.unsubscribeTopic("battle");
});

function startBattle() {
    gameStore.wsAction("action_start_battle", "test");
}
function actionBattle() {
    gameStore.wsAction("action_battle", {
        battleId: battle.value?.id,
        action: "test",
    });
}
</script>
