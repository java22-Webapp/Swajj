<script setup>
import { useNicknameStore} from "@/stores/nickname";

const nickNameStore = useNicknameStore();


</script>

<template>
  <div>Nickname: {{ nickNameStore.nickname }} </div>
</template>


<style scoped></style>