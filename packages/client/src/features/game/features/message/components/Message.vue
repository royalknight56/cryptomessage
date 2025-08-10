<template>
    <div>
        Add:
        <input type="text" v-model="addUser"></input>
        <button @click="handleAddUser">add</button>
        <div v-for="user in users" :key="user.id">
            {{ user.username }}
        </div>
        Message:
        <div v-for="message in messages" :key="message.id">
            {{ message.message }}
        </div>
        <textarea v-model="message"></textarea>
        <button @click="sendMessage">send</button>
    </div>
</template>
<script setup lang="ts">
import { useGameStore } from "@/stores";
import type { TopicPayload } from "@idleworld/types";
import { onMounted, onUnmounted, ref } from "vue";

const gameStore = useGameStore();

const messages = ref<{ id: number; message: string }[]>([]);
const message = ref("");
const addUser = ref("");
const publicKey = ref("");

const users = ref<{ id: number; username: string }[]>([]);



const handleAddUser = () => {
    users.value.push({ id: users.value.length + 1, username: addUser.value });
    addUser.value = "";
};


const sendPublicKey = () => {
    gameStore.wsAction("action_message_send_public_key", { publicKey: publicKey.value, uids: [addUser.value] });
    publicKey.value = "";
};


const addUserToMessage = () => {
    gameStore.wsAction("action_message_add_user", { uids: [addUser.value] });
    addUser.value = "";
};

const sendMessage = () => {
    gameStore.wsAction("action_message_send", { message: message.value });
    message.value = "";
};

onMounted(() => {
    gameStore.subscribeTopic("online_user", (data: TopicPayload<{ onlineUsers: { id: number; username: string }[] }>) => {
        users.value = data.payload.onlineUsers;
    });
    gameStore.subscribeTopic("message", (data: TopicPayload<{ id: number; message: string }>) => {
        messages.value.push({ id: data.payload.id, message: data.payload.message });
    });
});

onUnmounted(() => {
    gameStore.unsubscribeTopic("message");
});
</script>
