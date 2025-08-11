<template>
    <div>
        Add:
        <div v-for="user in users" :key="user">
            <div v-if="user !== (player?.userId || '')" @click="handleSelectUser(user)">
                {{ user }}
            </div>
        </div>
        Message:
        <div v-for="message in messages" :key="message.id">
            {{ message.message }}
        </div>
        <textarea v-model="message"></textarea>
        <button @click="sendMessage">send</button>

        Friend Q
    </div>
</template>
<script setup lang="ts">
import { useGameStore } from "@/stores";
import type { TopicPayload } from "@idleworld/types";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { arrayBufferToBase64, base64ToArrayBuffer, decryptWithMyPrivate, encryptWithPeer, exportPublicKey, genKeyPair, importPublicKey } from "../lib/key-exchange";

const gameStore = useGameStore();

const messages = ref<{ id: number; message: string }[]>([]);
const message = ref("");

const selectUser = ref<string>("");
const users = ref<string[]>([]);
const player = computed(() => gameStore.player);

const sharedKeyMap = ref<Map<string, CryptoKey>>(new Map());

let keyPair: CryptoKeyPair;


const sendMessage = async () => {
    let publicKey = sharedKeyMap.value.get(selectUser.value);
    if (publicKey) {
        const encryptedMessage = await encryptWithPeer(publicKey, message.value);
        gameStore.wsAction("action_message_send_to_user", { message: encryptedMessage, to: selectUser.value });
    }
};


const startAddUser = async (uid: string) => {

    // 导出公钥发给对方
    const publicKeyBuffer = await exportPublicKey(keyPair.publicKey as CryptoKey);
    gameStore.wsAction("action_message_send_public_key", { publicKey: arrayBufferToBase64(publicKeyBuffer), uid: uid });

}


const handleSelectUser = (uid: string) => {
    selectUser.value = uid;
    startAddUser(uid);
}


onMounted(async () => {
    // 生成密钥对
    const genkeyPair = await genKeyPair();
    keyPair = genkeyPair;

    gameStore.subscribeTopic("online_user", (data: TopicPayload<{ onlineUsers: string[] }>) => {
        users.value = data.payload.onlineUsers;
    });
    gameStore.subscribeTopic("message", async (data: TopicPayload<{ id: number; message: string, from: string }>) => {

        messages.value.push({ id: data.payload.id, message: await decryptWithMyPrivate(keyPair.privateKey as CryptoKey, data.payload.message) });
    });
    gameStore.subscribeTopic("add_user", (data: TopicPayload<{ uid: string }>) => {
        startAddUser(data.payload.uid);
    });
    gameStore.subscribeTopic("public_key", async (data: TopicPayload<{ publicKey: string; from: string; to: string }>) => {
        if (sharedKeyMap.value.has(data.payload.from)) {
            return;
        }
        sharedKeyMap.value.set(data.payload.from, await importPublicKey(base64ToArrayBuffer(data.payload.publicKey)));
        startAddUser(data.payload.from)
    });

    gameStore.wsAction("action_get_online_user", {});
});

onUnmounted(() => {
    gameStore.unsubscribeTopic("message");
});
</script>
