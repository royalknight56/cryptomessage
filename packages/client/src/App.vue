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

// const unregister = async () => {
//   await fetch("http://localhost:3001/api/auth/unregister", {
//     method: "POST",
//     body: JSON.stringify({
//       userId: "123",
//     }),
//   });
// };
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
