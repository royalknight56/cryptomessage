<template>
    <div class="logo-header">
        <div class="logo">
            <div class="logo-icon">🚀</div>
            <h1>CryptoMessage</h1>
        </div>
        <p class="welcome-text"></p>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.logo-header {
    text-align: center;
    margin-bottom: 32px;
}

.logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
}

.logo-icon {
    font-size: 48px;
    margin-bottom: 12px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.logo h1 {
    font-size: 28px;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
    letter-spacing: -0.5px;
}

.welcome-text {
    color: #718096;
    font-size: 16px;
    margin: 0;
    font-weight: 500;
}
</style>
