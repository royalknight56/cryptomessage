<template>
    <div class="bag">
        <div v-for="(,index) in new Array(bag.maxCapacity)" class="bag-item-container"
            :key="(bag.items[index]?.id ?? '') + bag.items[index]?.createdAt + index" @click="selectItem(index)"
            @dragstart="dragStart(index)" @dragover.prevent @drop="drop(index)"
            @contextmenu.prevent="(e) => showContextMenu(e, index)" :draggable="!!bag.items[index]">
            <BagItem :item="bag.items[index]"></BagItem>
        </div>
    </div>
    <div class="bag-contextmenu" v-if="selectedItem !== null" :style="{
        top: `${contextMenuPosition.y}px`,
        left: `${contextMenuPosition.x}px`,
    }">
        <div class="bag-contextmenu-item" @click="addItem">add item</div>
        <div class="bag-contextmenu-item" @click="removeItem">remove item</div>
        <div class="bag-contextmenu-item" @click="equipWeapon">equip weapon</div>
        <div class="bag-contextmenu-item" @click="unequipWeapon">unequip weapon</div>
    </div>
</template>
<script setup lang="ts">
import { useGameStore } from "@/stores";
import type { UserBag } from "@idleworld/types";
import BagItem from "./BagItemDisplay.vue";
import { computed, ref } from "vue";

const gameStore = useGameStore();
const bag = computed(() => gameStore.bag ?? {
    items: {},
    maxCapacity: 10,
});
const selectedItem = ref<number | null>(null);
const contextMenuPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 });

const selectItem = (index: number) => {
    selectedItem.value = index;
};

const addItem = async () => {
    await gameStore.wsAction<{ items: UserBag }>("action_add_item", {});
};

const dragStart = (index: number) => {
    selectedItem.value = index;
};

const showContextMenu = (e: MouseEvent, index: number) => {
    selectedItem.value = index;
    contextMenuPosition.value = {
        x: e.clientX,
        y: e.clientY,
    };
};


const drop = async (index: number) => {
    if (selectedItem.value === null) return;
    await gameStore.wsAction<{ bag: UserBag }>("action_move_item", {
        from: selectedItem.value,
        to: index,
    });
};

const removeItem = async () => {
    if (selectedItem.value === null) return;
    await gameStore.wsAction<{ bag: UserBag }>("action_remove_item", {
        index: selectedItem.value,
    });
};

const equipWeapon = async () => {
    if (selectedItem.value === null) return;
    await gameStore.wsAction<{ bag: UserBag }>("action_equip_weapon", {
        position: selectedItem.value,
    });
};

const unequipWeapon = async () => {
    if (selectedItem.value === null) return;
    await gameStore.wsAction<{ bag: UserBag }>("action_unequip_weapon", {
        position: bag.value.items[selectedItem.value]?.armorPosition,
    });
};
</script>
<style scoped>
.bag {
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
    gap: 10px;
    width: 800px;
    height: 100%;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
}

.bag-item-container {
    position: relative;
}

.bag-contextmenu {
    position: absolute;
    background-color: #f0f0f0;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 10px;
}
</style>
