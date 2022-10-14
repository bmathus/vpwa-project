
<template>
  <q-page class="row justify-center">
    <div class="q-pa-md messages-box">
      <q-infinite-scroll @load="onLoad" reverse :offset="50">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <q-chat-message :text="[message.message]" :sent="message.id % 2 == 0 ? true : false"
          v-for="message in store.getMessages" :key="message.id" :bg-color="message.id % 2 == 0 ? '' : 'teal-3'">
          <template v-slot:name>{{message.sender_name}}</template>
          <template v-slot:stamp>{{message.send_at}}</template>
          <template v-slot:avatar>
            <q-avatar rounded color="primary" text-color="dark"
              :class="messageClass(message.id % 2 == 0 ? true : false)" style="height:35px; width:35px">
              <div class="text-body1 text-weight-medium">{{message.sender_name[0].toUpperCase()}}</div>
            </q-avatar>
          </template>
        </q-chat-message>

      </q-infinite-scroll>

    </div>
  </q-page>

</template>

<script lang="ts">
import { reactive } from 'vue'
import { useChannelStore } from '../stores/channelstore';


export default {

  setup() {
    const store = useChannelStore()

    store.fetchMessages()

    function onLoad(index: unknown, done: () => void) {
      setTimeout(() => {
        store.fetchMessages()
        done()
      }, 2000)
    }

    function messageClass(isSent: boolean): object {
      return reactive({
        'q-mb-xs': true,
        'q-message-avatar--sent': isSent,
        'q-message-avatar--received': !isSent
      })
    }
    return {
      store,
      messageClass,
      onLoad,
    }
  }
}

</script>

<style scoped>
.messages-box {
  width: 100%;
  max-width: 1250px;
}
</style>
