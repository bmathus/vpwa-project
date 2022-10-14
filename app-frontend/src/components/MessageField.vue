<template>
  <div class="text-box">
    <textarea placeholder="Message" v-model="messageText" @keyup.enter="sendMessage($event)" />
    <q-btn flat icon="send" color="teal" padding="xs" class="send-btn" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useChannelStore } from '../stores/channelstore';

export default defineComponent({
  name: 'MessageField',
  setup() {
    const store = useChannelStore();
    const messageText = ref('')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function sendMessage(event: any): void {
      if (!event.shiftKey && messageText.value.trim() !== '') {
        store.pushMessage(messageText.value.trim())
        messageText.value = ''
      }
    }
    return {
      messageText,
      sendMessage
    }
  }
})

</script>

<style scoped>
.text-box {
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.text-box textarea {
  resize: none !important;
  height: 150px;
  width: 100%;
  padding: 14px 38px 14px 14px;
  border-radius: 8px;
  border: solid 2px grey;
  outline-color: teal;
  margin: -6px 16px 16px 16px;
}

.text-box button {
  margin: 0px 14px 14px 0px;
}

.text-box .send-btn {
  position: absolute;
  bottom: 5px;
  right: 4px;
}
</style>