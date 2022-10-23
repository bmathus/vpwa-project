
<template>
  <q-page class="column justify-center items-center">
    <div class="q-pa-md messages-box">
      <q-infinite-scroll @load="onLoad" reverse :offset="50" ref="infiniteScroll" id="infinite">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>
        <q-chat-message :text="[highlightPing(message.message)]" :sent="userIsSender(message)" text-html
          v-for="message in store.getMessages" :key="message.id" :bg-color="userIsSender(message) ? '' : 'teal-3'">
          <template v-slot:name>{{ message.sender_nickname }}</template>
          <template v-slot:stamp>{{ message.send_at }}</template>
          <template v-slot:avatar>
            <q-avatar rounded color="primary" text-color="dark" :class="messageClass(userIsSender(message))"
              style="height:35px; width:35px">
              <div class="text-body1 text-weight-medium">{{ message.sender_nickname[0].toUpperCase() }}</div>
            </q-avatar>
          </template>
        </q-chat-message>
      </q-infinite-scroll>

    </div>

  </q-page>

</template>

<script lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useChannelStore } from '../stores/channelstore';
import { Message } from '../stores/interfaces'
import { useUserStore } from '../stores/userstore';

export default {

  setup() {
    const store = useChannelStore();
    const userstore = useUserStore();
    const infiniteScroll = ref()
    store.fetchMessages()


    // store.scroll.tobottom = function (): void {
    //   let elmnt = document.getElementById('infinite');
    //   if (elmnt !== null) {
    //     elmnt.scrollIntoView(false);
    //   }
    // }

    onMounted(() => {
      store.$state.infiniteScroll = {
        stopOnLoad: () => infiniteScroll.value.stop(),
        resumeOnLoad: () => infiniteScroll.value.resume()
      }
    })

    function userIsSender(message: Message): boolean {
      if (message.user_id === userstore.getUser.id) {
        return true;
      } else {
        return false;
      }
    }

    function messageClass(isSend: boolean): object {
      return reactive({
        'q-mb-xs': true,
        'q-message-avatar--sent': isSend,
        'q-message-avatar--received': !isSend
      })
    }

    function onLoad(index: unknown, done: () => void) {
      setTimeout(() => {
        store.fetchMessages()
        done()
      }, 2000)
    }

    function highlightPing(message: string): string {
      const trimmed_message = message.trim()
      const ping_string =
        `<div style="background-color:rgb(242,192,55); border-radius: 3px; display:inline-block;" class="text-weight-medium">
        @${userstore.getUser.nickname}
        </div>`

      if (trimmed_message.startsWith(`@${userstore.getUser.nickname}`)) {
        return trimmed_message.replace(`@${userstore.getUser.nickname}`, ping_string)
      } else {
        return trimmed_message.replace(` @${userstore.getUser.nickname}`, ping_string)
      }

    }

    return {
      infiniteScroll,
      store,
      messageClass,
      onLoad,
      userIsSender,
      highlightPing,
    }
  }
}

</script>

<style scoped>
.messages-box {
  width: 100%;
  max-width: 1300px;
}

.ping {
  color: brown;
}
</style>
