<template>
    <div class="bag-item" v-if="item">
        <div class="bag-item-name">{{ item.name }}</div>
        <div class="bag-item-count">{{ item.count }}</div>
        <div class="bag-item-equipped" v-if="item.equipped">
            U
        </div>
    </div>
    <div class="bag-item" v-else>
        <div class="bag-item-empty-icon">
            <!-- <Icon name="mdi:plus" /> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import type { BagItem } from "@idleworld/types";

defineProps<{
    item?: BagItem | null;
}>();
</script>
<style scoped>
.bag-item {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    position: relative;
    width: 80px;
    height: 80px;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
    cursor: pointer;
}

.bag-item-name {
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    top: 0;
    left: 0;
}

.bag-item-count {
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    bottom: 0;
    right: 0;
}
</style>
