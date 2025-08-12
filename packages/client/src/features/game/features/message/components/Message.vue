<template>
    <div class="message-container">
        <!-- 左侧联系人面板 -->
        <div class="contacts-panel">
            <!-- 好友列表 -->
            <div class="friends-section">
                <div class="section-header">好友列表</div>
                <div class="friends-list">
                    <div v-for="friend in sharedKeyMap.keys()" :key="friend"
                        :class="['friend-item', { 'active': friend === selectUser }]" @click="handleSelectUser(friend)">
                        <div class="user-avatar">{{ friend.charAt(0).toUpperCase() }}</div>
                        <div class="user-name">{{ friend }}</div>
                    </div>
                </div>
            </div>

            <!-- 在线用户 -->
            <div class="online-users-section">
                <div class="section-header">在线用户</div>
                <div class="online-users-list">
                    <div v-for="user in users" :key="user">
                        <div v-if="user !== (player?.userId || '')" class="online-user-item"
                            @click="handleAddUser(user)">
                            <div class="user-avatar">{{ user.charAt(0).toUpperCase() }}</div>
                            <div class="user-name">{{ user }}</div>
                            <div class="add-button">+</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 好友请求 -->
            <div class="friend-requests-section" v-if="friendRequests.length > 0">
                <div class="section-header">好友请求</div>
                <div class="friend-requests-list">
                    <div v-for="request in friendRequests" :key="request.id" class="friend-request-item">
                        <div class="user-avatar">{{ request.id.charAt(0).toUpperCase() }}</div>
                        <div class="request-info">
                            <div class="request-name">{{ request.id }}</div>
                            <button v-if="request.type === 'other'" class="accept-button"
                                @click="handleAcceptFriendRequest(request)">
                                接受
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧聊天面板 -->
        <div class="chat-panel">
            <!-- 聊天头部 -->
            <div class="chat-header">
                <div v-if="selectUser" class="chat-title">
                    <div class="chat-avatar">{{ selectUser.charAt(0).toUpperCase() }}</div>
                    <div class="chat-user-name">{{ selectUser }}</div>
                </div>
                <div v-else class="chat-placeholder">请选择一个好友开始聊天</div>
            </div>

            <!-- 消息区域 -->
            <div class="messages-area">
                <div v-if="!selectUser" class="no-chat-selected">
                    <div class="welcome-text">欢迎使用消息系统</div>
                    <div class="welcome-desc">选择左侧好友开始安全聊天</div>
                </div>
                <div v-else class="messages-list">
                    <div v-for="message in messages" :key="message.id" class="message-bubble">
                        <div class="message-content">{{ message.message }}</div>
                        <div class="message-time">{{ new Date().toLocaleTimeString() }}</div>
                    </div>
                </div>
            </div>

            <!-- 输入区域 -->
            <div class="input-area" v-if="selectUser">
                <div class="input-container">
                    <textarea v-model="message" class="message-input" placeholder="输入消息..."
                        @keydown.enter.prevent="sendMessage" rows="3"></textarea>
                    <button class="send-button" @click="sendMessage" :disabled="!message.trim()">
                        发送
                    </button>
                </div>
            </div>
        </div>
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

const friendRequests = ref<{
    id: string;
    type: string
    publicKey: string;
}[]>([]);
const sharedKeyMap = ref<Map<string, CryptoKey>>(new Map());

let keyPair: CryptoKeyPair;


const sendMessage = async () => {
    if (!message.value.trim()) return;

    let publicKey = sharedKeyMap.value.get(selectUser.value);
    if (publicKey) {
        const encryptedMessage = await encryptWithPeer(publicKey, message.value);
        gameStore.wsAction("action_message_send_to_user", { message: encryptedMessage, to: selectUser.value });
        message.value = ""; // 清空输入框
    }
};


const startAddUser = async (uid: string) => {
    friendRequests.value.push({ id: uid, type: "self", publicKey: "" });
    // 导出公钥发给对方
    const publicKeyBuffer = await exportPublicKey(keyPair.publicKey as CryptoKey);
    gameStore.wsAction("action_message_send_public_key", { publicKey: arrayBufferToBase64(publicKeyBuffer), uid: uid });

}
const handleAddUser = (uid: string) => {
    if (sharedKeyMap.value.has(uid)) {
        return;
    }
    if (friendRequests.value.find(request => request.id === uid)) {
        return;
    }
    startAddUser(uid);
}

const handleSelectUser = (uid: string) => {
    selectUser.value = uid;

}

const handleAcceptFriendRequest = async (request: { id: string; publicKey: string }) => {
    friendRequests.value = friendRequests.value.filter(request => request.id !== request.id);
    sharedKeyMap.value.set(request.id, await importPublicKey(base64ToArrayBuffer(request.publicKey)));
    startAddUser(request.id);
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
        const hasRequest = friendRequests.value.find(request => request.id === data.payload.from);
        console.log(hasRequest);
        if (hasRequest && hasRequest.type === "self") {
            handleAcceptFriendRequest({ id: data.payload.from, publicKey: data.payload.publicKey });
            return;
        }
        if (hasRequest && hasRequest.type === "other") {
            return;
        }
        friendRequests.value.push({ id: data.payload.from, type: "other", publicKey: data.payload.publicKey });
    });

    gameStore.wsAction("action_get_online_user", {});
});

onUnmounted(() => {
    gameStore.unsubscribeTopic("message");
});
</script>
<style scoped>
.message-container {
    display: flex;
    height: 100%;
    width: 100%;
    border-radius: 0;
    overflow: hidden;
    box-shadow: none;
    background: #fff;
}

/* 左侧联系人面板 */
.contacts-panel {
    width: 300px;
    background: #f7f7f7;
    border-right: 1px solid #e5e5e5;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.section-header {
    padding: 16px;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    background: #eeeeee;
    border-bottom: 1px solid #e0e0e0;
}

/* 好友列表样式 */
.friends-list,
.online-users-list,
.friend-requests-list {
    flex: 1;
}

.friend-item,
.online-user-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid #f0f0f0;
}

.friend-item:hover,
.online-user-item:hover {
    background: #e8f4f8;
}

.friend-item.active {
    background: #007acc;
    color: white;
}

.friend-avatar,
.user-avatar,
.chat-avatar,
.request-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
    background: #4a90e2;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 12px;
    font-size: 16px;
}

.friend-name,
.user-name {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.add-button {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #4caf50;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
}

/* 好友请求样式 */
.friend-request-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
}

.request-info {
    flex: 1;
    margin-left: 12px;
}

.request-name {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
}

.accept-button {
    background: #4caf50;
    color: white;
    border: none;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.accept-button:hover {
    background: #45a049;
}

/* 右侧聊天面板 */
.chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
}

/* 聊天头部 */
.chat-header {
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    background: #fafafa;
}

.chat-title {
    display: flex;
    align-items: center;
}

.chat-user-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.chat-placeholder {
    color: #999;
    font-size: 16px;
}

/* 消息区域 */
.messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f9f9f9;
}

.no-chat-selected {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
}

.welcome-text {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
}

.welcome-desc {
    font-size: 14px;
}

.messages-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message-bubble {
    max-width: 70%;
    align-self: flex-end;
    background: #007acc;
    color: white;
    padding: 12px 16px;
    border-radius: 18px 18px 4px 18px;
    position: relative;
}

.message-content {
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
}

.message-time {
    font-size: 11px;
    opacity: 0.7;
    margin-top: 4px;
    text-align: right;
}

/* 输入区域 */
.input-area {
    border-top: 1px solid #e5e5e5;
    background: white;
    padding: 16px 20px;
}

.input-container {
    display: flex;
    gap: 12px;
    align-items: flex-end;
}

.message-input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
}

.message-input:focus {
    border-color: #007acc;
}

.send-button {
    background: #007acc;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    height: fit-content;
}

.send-button:hover:not(:disabled) {
    background: #005a9e;
}

.send-button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

/* 滚动条样式 */
.contacts-panel::-webkit-scrollbar,
.messages-area::-webkit-scrollbar {
    width: 6px;
}

.contacts-panel::-webkit-scrollbar-track,
.messages-area::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.contacts-panel::-webkit-scrollbar-thumb,
.messages-area::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.contacts-panel::-webkit-scrollbar-thumb:hover,
.messages-area::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .message-container {
        height: 100vh;
        margin: 0;
        border-radius: 0;
    }

    .contacts-panel {
        width: 250px;
    }

    .friend-avatar,
    .user-avatar,
    .chat-avatar,
    .request-avatar {
        width: 36px;
        height: 36px;
        font-size: 14px;
    }
}
</style>
