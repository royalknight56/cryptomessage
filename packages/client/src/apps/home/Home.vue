<template>
    <div>Home
        <UserInfo></UserInfo>
        <Message></Message>
    </div>
</template>

<script setup lang="ts">
import UserInfo from '@/features/user/features/info/components/UserInfo.vue';
import Message from '@/features/game/features/message/components/Message.vue';
import { ref } from 'vue';
const isBattleVisible = ref(false);
const showBattle = () => {
    isBattleVisible.value = true;
}
</script>
