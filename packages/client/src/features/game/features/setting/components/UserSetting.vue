<template>
    <div class="settings-container">
        <div class="settings-header">
            <h2>应用设置</h2>
            <p class="settings-subtitle">个性化你的使用体验</p>
        </div>

        <div class="settings-content">
            <div class="settings-section">
                <h3>外观设置</h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <label>主题模式</label>
                        <span class="setting-desc">选择你喜欢的界面主题</span>
                    </div>
                    <select v-model="theme" class="setting-control">
                        <option value="light">浅色模式</option>
                        <option value="dark">深色模式</option>
                        <option value="auto">跟随系统</option>
                    </select>
                </div>
            </div>

            <div class="settings-section">
                <h3>通知设置</h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <label>消息通知</label>
                        <span class="setting-desc">接收新消息时显示通知</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="notifications" />
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <label>声音提醒</label>
                        <span class="setting-desc">新消息到达时播放提示音</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="soundEnabled" />
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <h3>隐私与安全</h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <label>自动保存聊天记录</label>
                        <span class="setting-desc">在本地设备上保存聊天历史</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="autoSaveChat" />
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="settings-actions">
                <button class="save-button" @click="saveSettings">保存所有设置</button>
                <button class="reset-button" @click="resetSettings">恢复默认设置</button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';


// 设置相关
const theme = ref('light');
const notifications = ref(true);
const soundEnabled = ref(true);
const autoSaveChat = ref(true);
const saveSettings = () => {
    // 这里可以添加保存设置到本地存储或服务器的逻辑
    console.log('设置已保存:', {
        theme: theme.value,
        notifications: notifications.value,
        soundEnabled: soundEnabled.value,
        autoSaveChat: autoSaveChat.value
    });
    // 可以添加成功提示
    alert('设置保存成功！');
};

const resetSettings = () => {
    theme.value = 'light';
    notifications.value = true;
    soundEnabled.value = true;
    autoSaveChat.value = true;
    console.log('设置已恢复默认');
    alert('设置已恢复默认值！');
};

</script>
<style scoped>
.settings-container {
    /* background: white; */
    border-radius: 16px;
    padding: 30px;
    /* max-width: 600px; */
    width: 90%;
    /* box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); */
}

.settings-header {
    text-align: center;
    margin-bottom: 30px;
}

.settings-header h2 {
    margin-bottom: 10px;
    font-size: 28px;
    font-weight: 700;
    color: #333;
}

.settings-subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
}

.settings-content {
    /* max-height: 600px; */
    /* Adjust as needed */
    overflow-y: auto;
}

.settings-section {
    margin-bottom: 30px;
    padding-bottom: 25px;
    border-bottom: 1px solid #f0f0f0;
}

.settings-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.settings-section h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
    margin-bottom: 0;
    border-bottom: none;
}

.setting-info {
    flex: 1;
    margin-right: 20px;
}

.setting-info label {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    display: block;
    margin-bottom: 5px;
}

.setting-desc {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
}

.setting-control {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 150px;
    /* Adjust as needed */
}

.setting-control:focus {
    border-color: #007acc;
}


input:checked+.toggle-slider {
    background-color: #007acc;
}

input:focus+.toggle-slider {
    box-shadow: 0 0 1px #007acc;
}

input:checked+.toggle-slider:before {
    transform: translateX(20px);
}

.settings-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-top: 30px;
    padding-top: 25px;
    border-top: 1px solid #f0f0f0;
    flex-wrap: wrap;
}

.save-button,
.reset-button,
.back-button {
    background: #007acc;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 120px;
}

.save-button:hover {
    background: #005a9e;
}

.reset-button {
    background: #e74c3c;
}

.reset-button:hover {
    background: #c0392b;
}

.back-button {
    background: #6c757d;
}

.back-button:hover {
    background: #5a6268;
}

/* 滚动条样式 */
.settings-content::-webkit-scrollbar {
    width: 6px;
}

.settings-content::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.settings-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.settings-content::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}


.toggle-switch {
    position: relative;
    width: 40px;
    height: 20px;
    margin-left: 10px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 20px;
    transition: .4s;
    margin-top: 2px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background-color: white;
    transition: .4s;
}
</style>
