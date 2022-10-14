
<template>
  <q-page class="row justify-center">
    <div class="q-pa-md messages-box">
      <q-infinite-scroll @load="onLoad" reverse :offset="50">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <q-chat-message name="me" avatar="https://cdn.quasar.dev/img/avatar4.jpg" :text="['hey, how are you?']"
          :sent="index % 2 == 0 ? true : false" stamp="7 minutes ago" v-for="(message, index) in messages" :key="index">
        </q-chat-message>

      </q-infinite-scroll>

    </div>
  </q-page>

</template>


  
<script>
import { reactive } from 'vue'
import { useChannelStore } from '../stores/channelstore';

const messagesToAdd = [
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

    return {
      store,
      messages,
      onLoad(index, done) {
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
