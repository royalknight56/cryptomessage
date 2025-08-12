<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from './composables/useAuth';
import { useRouter } from 'vue-router';

const { getCurrentUser } = useAuth();
const router = useRouter()
onMounted(async () => {
  const user = await getCurrentUser();
  console.log(user);
  if (!user) {
    router.push({
      path: "/login"
    })
  }
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
