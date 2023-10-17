<script setup>
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.emit('chatMessage', 'Hello world!');
socket.on('messageAcknowledgement', (acknowledgement) =>{
  console.log(acknowledgement);
  console.log("Socket from inviteView is connected");
})
socket.on('connect', ()=>{
  console.log('Connected to Socket server')
})


</script>
<template>
  <div>Invitee View</div>
</template>
<style scoped></style>
