
<template>
  <q-page class="row justify-center">
    <div class="q-pa-md messages-box">
      <q-infinite-scroll @load="onLoad" reverse :offset="50">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <q-chat-message :text="[message.message]" :sent="index % 2 == 0 ? true : false"
          v-for="(message, index) in messages" :key="index" :bg-color="index % 2 == 0 ? '' : 'teal-3'">
          <template v-slot:name>Name</template>
          <template v-slot:stamp>9:30 10.02.2022</template>
          <template v-slot:avatar>
            <q-avatar rounded color="primary" text-color="dark" :class="messageClass(index % 2 == 0 ? true : false)"
              style="height:35px; width:35px">
              <div class="text-body1 text-weight-medium">{{"Matus"[0].toUpperCase()}}</div>
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

const messagesToAdd = [
  {
    name: 'Jane',
    message: 'cauko',
    time: '10.2.2022 9:32'
  },
  {
    name: 'me',
    message: 'hey, how are you?',
    time: '10.2.2022 9:32'
  },
  {
    name: 'Jane',
    message: 'doing fine, how r you?',
    time: '10.2.2022 9:32'
  },
  {
    name: 'me',
    message: 'hey, how are you?',
    time: '10.2.2022 9:32'
  },
  {
    name: 'Jane',
    message: 'doing fine, how r you?',
    time: '10.2.2022 9:32'
  },
  {
    name: 'me',
    message: 'hey, how are you?',
    time: '10.2.2022 9:32'
  },
  {
    name: 'Jane',
    message: 'doing fine, how r you?',
    time: '10.2.2022 9:32'
  },
  {
    name: 'me',
    message: 'hey, how are you?',
    time: '10.2.2022 9:32'
  },
]

export default {

  setup() {
    const messages = reactive(messagesToAdd);
    const store = useChannelStore()

    function messageClass(isSent: boolean): object {
      return reactive({
        'q-mb-xs': true,
        'q-message-avatar--sent': isSent,
        'q-message-avatar--received': !isSent
      })
    }

    return {
      store,
      messages,
      messageClass,
      onLoad(index: unknown, done: () => void) {
        setTimeout(() => {
          messages.splice(0, 0, ...messagesToAdd)
          done()
        }, 2000)

      }


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
