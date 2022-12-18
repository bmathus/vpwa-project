<template>
  <div class="align-box column justify-center items-center">
    <div class="max-width-box">
      <live-typing></live-typing>
      <div class="text-box">
        <q-badge color="teal-8" outline class="offline-badge" v-if="disableTextArea">You are offline</q-badge>
        <textarea placeholder="Message" v-model="messageText" @keydown.enter.prevent="sendMessage" :disabled="disableTextArea"/>
        <q-btn v-if="!sendLoading" flat icon="send" color="teal" padding="xs" class="send-btn" @click="sendMessage" />
        <q-spinner v-else color="teal" size="sm" :thickness="6" class="send-loading"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Status } from 'src/contracts';
import { defineComponent, ref, computed, watch } from 'vue';
import { useChannelStore } from '../stores/channelstore';
import { useUserStore } from '../stores/userstore';
import LiveTyping from './LiveTyping.vue';


export default defineComponent({
  name: 'MessageField',
  components: {
    LiveTyping
  },
  setup() {
    const store = useChannelStore();
    const userstore = useUserStore();
    const messageText = ref('')
    const $q = useQuasar();
    const sendLoading = ref(false)

    const disableTextArea = computed(() => {
      if(userstore.status === Status.offline) {
        return true
      }else {
        return false
      }
    })

    const aChannel = computed(() => {
      if (store.active_channel !== null){
        return store.active_channel.name !== null ? store.active_channel.name : ''
      }
      return  ''
    })


    function leaveChannelConfirm(msg: string, title: string) {
      store.stopMessagesLoading()

      $q.dialog({
        title: title,
        message: msg,
        persistent: true,
        ok: {
          label: 'yes',
          color: 'teal',
          flat: true
        },
        cancel: {
          color: 'teal',
          flat: true
        },
        class: 'q-pa-sm'
      }).onOk(async () => {
        const result = await store.leaveChannel()
        store.addNotification(result)

        store.resumeMessagesLoading()
      }).onCancel(() => {
        store.resumeMessagesLoading()
        //console.log('>>>> Cancel')
      })
    }

    const iamAdmin = computed(() => {
      if (store.getActiveChannel !== null && store.getActiveChannel.admin) {
        return true
      } else {
        return false;
      }
    })

    const channelIsPublic = computed(() => {
      if (store.getActiveChannel !== null && store.getActiveChannel.type == 'public') {
        return true;
      } else {
        return false;
      }
    })

    const myPermitions = computed(() => {
      if (store.channelsAreEmpty) {
        return ['join']
      }
      if (!iamAdmin.value && !channelIsPublic.value) {
        return ['join', 'list', 'cancel']
      }
      if (!iamAdmin.value && channelIsPublic.value) {
        return ['join', 'list', 'cancel', 'invite', 'kick',]
      }
      if (iamAdmin.value && !channelIsPublic.value) {
        return ['join', 'list', 'cancel', 'invite', 'revoke', 'quit' ];
      }
      if (iamAdmin.value && channelIsPublic.value) {
        return ['join', 'list', 'cancel', 'invite', 'kick', 'quit',];
      }
      return []
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function sendMessage(): Promise<void> {

      if (messageText.value.trim() ==='')  return


      let command = messageText.value.replace('\n', '').trim().split(' ')
      let command_text = messageText.value.replace('\n', '').trim()
      messageText.value = ''
      sendLoading.value = true;


      if (command[0] == '/join' && myPermitions.value.includes('join')) {

        let message_join = command_text.split(' ').slice(1) //ged rid of /join

        if(message_join[message_join.length - 1] == '\[private\]'){ //ged rid of [private]
          message_join.splice(-1, 1)
        }

        let channel_name = message_join.join(' ').trim()

        if (channel_name.length !== 0 && channel_name.length <= 20 && command_text.split(' ').pop() == '\[private\]') {
          const responce = await store.joinChannel(channel_name,'private',false)
          store.addNotification(responce)

        } else if(channel_name.length !== 0 && channel_name.length <= 20){
          const responce = await store.joinChannel(channel_name,'public',false)
          store.addNotification(responce)

        }else {
          store.addNotification('Incorrect command')
        }

      }
      else if (command[0] == '/cancel' && myPermitions.value.includes('cancel')) {

        if (command_text.split(' ', 2).length > 1) {
          store.addNotification('Incorrect command')
        }
        else {
          let message = ''
          let title = ''
          if (iamAdmin.value) {
            message = 'Do you really want to leave this channel? Channel will be deleted'
            title = 'Delete channel'
          }
          else {
            message = 'Do you really want to leave this channel?'
            title = 'Leave channel'

          }
          leaveChannelConfirm(message, title)
        }


      }
      else if (command[0] == '/quit' && myPermitions.value.includes('quit')) {

        if (command_text.split(' ', 2).length > 1) {
          store.addNotification('Incorrect command')
        }
        else {
          const message = 'Do you really want to quit this channel? Channel will be deleted'
          leaveChannelConfirm(message, 'Delete channel')
        }


      }

      else if (command[0] == '/list' && myPermitions.value.includes('list')) {

        if (command_text.length == 5)
          store.toogleMembersDialog()
        else {
          store.addNotification('Incorrect command')
        }
      }
      else if (command[0] == '/revoke' && myPermitions.value.includes('revoke')) {

        let command = command_text.split(' ')
        const username = command[command.length -1]
        const between = command.slice(1,command.length -1)

        if (username !== '/revoke' && between.join(' ').trim().length === 0) {

          if (username == userstore.getUserNickname) {
            store.addNotification('You cannot revoke yourself out of the channel')

          } else {
            const status = await store.revokeUser(username)
            store.addNotification(status)
          }

        }else {
          store.addNotification('Incorrect command')
        }

      }
      else if (command[0] == '/kick' && myPermitions.value.includes('kick')) {

        let command = command_text.split(' ')
        const username = command[command.length -1]
        const between = command.slice(1,command.length -1)

        if (username !== '/kick' && between.join(' ').trim().length === 0) {

          if (username == userstore.getUserNickname) {
            store.addNotification('You cannot kick yourself out of the channel')
          }else{
            const status = await store.addKick(username)
            store.addNotification(status)

          }
        }else {
          store.addNotification('Incorrect command')
        }
      }
      else if (command[0] == '/invite' && myPermitions.value.includes('invite')) {
        let command = command_text.split(' ')
        const username = command[command.length -1]
        const between = command.slice(1,command.length -1)

        if (username !== '/invite' && between.join(' ').trim().length === 0 && userstore.user != null && store.active_channel != null) {
          console.log('good')
          const responce = await userstore.inviteUser(username)
          store.addNotification(responce)

        }
        else {
          store.addNotification('Incorrect command')
        }

      }else if(command[0].includes('/')) {
        store.addNotification('Incorrect command')

      }else {

        await store.addMessage({channel: aChannel.value, message: command_text})

      }
      sendLoading.value = false;

    }

    watch(messageText,(liveMessageText) => {
      if(liveMessageText.trim() === '') {
        if(liveMessageText.length === 0) {
          store.addLiveMessage(liveMessageText)
        }
      } else {
        store.addLiveMessage(liveMessageText)
      }

    })



    return {
      messageText,
      sendMessage,
      sendLoading,
      disableTextArea
    }
  }
})

</script>

<style scoped>
.text-box {
  width: 100%;
  display: flex;
  align-items: flex-end;
  position: relative;
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

.text-box .send-loading {
  position: absolute;
  bottom: 22px;
  right: 22px;
}
.text-box .offline-badge{
  position: absolute;
  top:0px;
  right: 22px;
}


.max-width-box {
  max-width: 1300px;
  width: 100%;
}


.align-box {
  width: 100%;
}
</style>
