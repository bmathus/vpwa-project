
<template>
  <q-page class="column items-center justify-end" id="page">
    <div class="q-px-md messages-box">
      <q-infinite-scroll @load="onLoad" reverse :offset="50" ref="infiniteScroll" id="infinite">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-oval color="teal" size="lg" />
          </div>
        </template>
        <q-chat-message
          v-for="message in messages"
          :text="[highlightPing(message.message)]"
          :sent="userIsSender(message)"
          :key="message.id"
          :bg-color="userIsSender(message) ? '' : 'teal-3'"
          text-html>
          <template v-slot:name>{{ message.user.nickname }}</template>
          <template v-slot:stamp>{{ formatDateTime(message.send_at) }}</template>
          <template v-slot:avatar>
            <q-avatar rounded :color="message.user.avatar_color" text-color="dark" :class="messageClass(userIsSender(message))"
              style="height:35px; width:35px">
              <div class="text-body1 text-weight-medium">{{ message.user.nickname[0].toUpperCase() }}</div>
            </q-avatar>
          </template>
        </q-chat-message>
        <div ref="scrolltobox" class="text-white">scrolltobox</div>
      </q-infinite-scroll>

    </div>

  </q-page>

</template>

<script lang="ts">
import { reactive, ref, onMounted, computed ,watch} from 'vue'
import { useChannelStore } from '../stores/channelstore';
import { useUserStore } from '../stores/userstore';
import { SerializedMessage } from '../contracts';
import { useQuasar } from 'quasar';

export default {

  setup() {
    const store = useChannelStore();
    const userstore = useUserStore();
    const infiniteScroll = ref()
    const scrolltobox = ref()
    const $q = useQuasar()

    const messages = computed(()=>{
      return store.getMessages
    })

    function userIsSender(message: SerializedMessage): boolean {
      return message.user.id === userstore.getUserId
    }

    function formatDateTime(sendAt: string) {
      return sendAt.slice(11,19) + ' ' + sendAt.slice(0,10)
    }


    onMounted(() => {

      infiniteScroll.value.stop() //started after channel is activated after

      store.$state.infiniteScroll = {
        stopOnLoad: () => infiniteScroll.value.stop(),
        resumeOnLoad: () => infiniteScroll.value.resume(),
        scrollBottom: (smooth: boolean) => {
          if (smooth) {
            scrolltobox.value.scrollIntoView({ behavior: 'smooth' })
          } else {
            scrolltobox.value.scrollIntoView()
          }
        }
      }
    })

    function messageClass(isSend: boolean): object {
      return reactive({
        'q-mb-xs': true,
        'q-message-avatar--sent': isSend,
        'q-message-avatar--received': !isSend
      })
    }

    const activeChannel = computed(()=> {
      return store.getActiveChannel
    })

    const notification = computed(()=> {
      return store.inAppNotification
    })


    watch(activeChannel,(newChannelValue) => {
      if(newChannelValue != null) {
        //console.log('fungujem')
        infiniteScroll.value.resume()

      }
    })

    watch(notification,(newNotification) => {
      $q.notify({
        type: 'info',
        message: newNotification,
        color: 'teal',
        timeout: 2500,
      });
    })

    async function onLoad(index: number, done: (stop: boolean) => void) {

      if(store.getActiveChannel !== null) {
          //console.log('az teraz',store.getActiveChannel !== null)
          const result = await store.loadMessages();

          if(result == 'load_more') {
            done(false);
          } else {
            done(true);
          }
      }
    }

    function highlightPing(message: string): string {
      const trimmed_message = message.trim()
      const ping_string =
        `<div style="background-color:rgb(242,192,55); border-radius: 3px; display:inline-block;" class="text-weight-medium">
        @${userstore.getUserNickname}
        </div>`

      if (trimmed_message.startsWith(`@${userstore.getUserNickname}`)) {
        return trimmed_message.replace(`@${userstore.getUserNickname}`, ping_string)
      } else {
        return trimmed_message.replace(` @${userstore.getUserNickname}`, ping_string)
      }

    }

    return {
      infiniteScroll,
      store,
      messageClass,
      onLoad,
      userIsSender,
      highlightPing,
      scrolltobox,
      messages,
      formatDateTime
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
