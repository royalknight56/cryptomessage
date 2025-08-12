<template>
    <div>
        武器：
        <BagItemDisplay :item="getItem(armor.weapon)" />
        头盔：
        <BagItemDisplay :item="getItem(armor.helmet)" />
        胸甲：
        <BagItemDisplay :item="getItem(armor.chest)" />
        护腿：
        <BagItemDisplay :item="getItem(armor.legs)" />
        护手：
        <BagItemDisplay :item="getItem(armor.hands)" />
        鞋子：
        <BagItemDisplay :item="getItem(armor.feet)" />
    </div>
</template>
<script setup lang="ts">
import { useGameStore } from "@/stores";
import BagItemDisplay from "@/features/game/features/bag/components/BagItemDisplay.vue";
import type { TopicPayload, UserArmor } from "@idleworld/types";
import { computed, onMounted, onUnmounted, ref } from "vue";
const armor = ref<UserArmor>({
    weapon: "",
    helmet: "",
    chest: "",
    legs: "",
    hands: "",
    feet: "",
});
const bag = computed(() => gameStore.bag ?? {
    items: {},
    maxCapacity: 10,
});
const getItem = (id: string) => {
    return Object.values(bag.value.items).find(item => item?.uniqueId === id);
}
const gameStore = useGameStore();
onMounted(() => {
    gameStore.subscribeTopic("armor", (data: TopicPayload<{
        armor: UserArmor;
    }>) => {
        armor.value = data.payload.armor;
    });
    gameStore.wsAction("action_get_armor", {});
});
onUnmounted(() => {
    gameStore.unsubscribeTopic("armor");
});
</script>
