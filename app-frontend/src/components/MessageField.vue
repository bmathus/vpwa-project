<template>
  <div class="align-box column justify-center items-center">
    <div class="max-width-box">
      <live-typing></live-typing>
      <div class="text-box">
        <textarea placeholder="Message" v-model="messageText" @keydown.enter.prevent="sendMessage" />
        <q-btn v-if="!sendLoading" flat icon="send" color="teal" padding="xs" class="send-btn" @click="sendMessage" />
        <q-spinner v-else color="teal" size="sm" :thickness="6" class="send-loading"/>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { useQuasar } from 'quasar';
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




    //tutorial part 3
    const aChannel = computed(() => {
      if (store.active_channel !== null){
        return store.active_channel.name !== null ? store.active_channel.name : ''
      }
      return  ''
    })


    function confirm(msg: string, title: string) {
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
        $q.notify({
          type: 'info',
          message: result,
          color: 'teal',
          timeout: 2500,
        });

        store.resumeMessagesLoading()
      }).onCancel(() => {
        store.resumeMessagesLoading()
        //console.log('>>>> Cancel')
      })
    }

    function notify_event(msg: string) {
      $q.notify({
        type: 'info',
        message: msg,
        color: 'teal',
        timeout: 2500,
      });
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
        return ['join', 'list', 'invite', 'kick', 'cancel']
      }
      if (iamAdmin.value && !channelIsPublic.value) {
        return ['join', 'list', 'invite', 'revoke', 'kick', 'quit', 'cancel'];
      }
      if (iamAdmin.value && channelIsPublic.value) {
        return ['join', 'list', 'invite', 'kick', 'quit', 'cancel'];
      }
      return []
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function sendMessage(): Promise<void> {

      if (messageText.value.trim() !== '') {


        let command = messageText.value.replace('\n', '').split(' ')
        let text = messageText.value.replace('\n', '')
        messageText.value = ''
        sendLoading.value = true;


        if (command[0] == '/join' && myPermitions.value.includes('join')) {

          let message_join = text.split(' ').slice(1)

          if(message_join[message_join.length - 1] == '\[public\]' || message_join[message_join.length - 1] == '\[private\]'){ // TODO na join bez []
            message_join.splice(-1, 1)
          }


          let channel_name = message_join.join(' ')

          if (!channel_name.includes('/') && channel_name.length <= 20 && text.split(' ').pop() == '\[public\]') {
            const responce = await store.createChannel(channel_name,'public')
            if(responce !== 'Channel is created succesfully.'){
              notify_event(responce)
            }
            else{
              notify_event('Public channel ' + channel_name + ' was created')
            }

          }

          else if (!channel_name.includes('/') && channel_name.length <= 20 && text.split(' ').pop() == '\[private\]') {
            const responce = await store.createChannel(channel_name,'private')
            if(responce !== 'Channel is created succesfully.'){
              notify_event(responce)
            }
            else{
              notify_event('Private channel ' + channel_name + ' was created')
            }

          }

          else if(!channel_name.includes('/') && channel_name.length <= 20){

            const message = await store.joinChannel(channel_name, null)

            if(message != null){
              notify_event(message)
            }
            else{
              notify_event('You have joined ' + channel_name)
            }

          }

          else {

            if (channel_name.includes('/')) {
              notify_event('Cannot create channel with special characters')
            }

            else {
              notify_event('Incorrect command')
            }

          }

        }
        else if (command[0] == '/cancel' && myPermitions.value.includes('cancel')) {

          if (text.split(' ', 2).length > 1) {
            notify_event('Incorrect command')
          }
          else {
            let message = ''
            if (iamAdmin.value) {
              message = 'Do you really want to leave this channel? Channel will be deleted'
            }
            else {
              message = 'Do you really want to leave this channel?'
            }
            confirm(message, 'Leave channel')
          }


        }
        else if (command[0] == '/quit' && myPermitions.value.includes('quit')) {

          if (text.split(' ', 2).length > 1) {
            notify_event('Incorrect command')
          }
          else {
            const message = 'Do you really want to quit this channel? Channel will be deleted'
            confirm(message, 'Leave channel')
          }


        }

        else if (command[0] == '/list' && myPermitions.value.includes('list')) {

          if (text.length == 5)
            store.toogleMembersDialog()
          else {
            notify_event('Incorrect command')
          }
        }
        else if (command[0] == '/revoke' && myPermitions.value.includes('revoke')) {

          let command = text.split(' ', 2)

          if (command[0] == '/revoke') {

            if (command[1] == userstore.getUserNickname) {
              notify_event('You cannot throw yourself out of the channel')
            }

            else {
              const status = store.makeRevoke(command[1])

              if (status == 2) {
                notify_event('Such user doesnt exist in this channel')
              }
            }


          }
          else {
            notify_event('Incorrect command')
          }

        }
        else if (command[0] == '/kick' && myPermitions.value.includes('kick')) {
          let command = text.split(' ', 2)

          if (command[0] == '/kick' && command.length >= 2) {

            if (command[1] == userstore.getUserNickname) {
              notify_event('You cannot kick yourself out of the channel')
            }

            else{
              const status = await store.addKick(command[1])

              if (status == 1) {
                notify_event('You kicked member ' + command[1])
              }

              else if (status == 2) {
                notify_event('Cannont kick the same user twice')
              }

              else if (status == 3) {
                notify_event('Such user doesnt exist in this channel')
              }

            }

          }
          else {
            notify_event('Incorrect command')
          }
        }
        else if (command[0] == '/invite' && myPermitions.value.includes('invite')) {
          let command = text.split(' ', 2)

          if (command[0] == '/invite' && command.length == 2 && userstore.user != null && store.active_channel != null) {
            const responce = await userstore.inviteUser(command[1])
            notify_event(responce)

          }
          else {
            notify_event('Incorrect command')
          }
        }
        else {
          await store.addMessage({channel: aChannel.value, message: text})

        }
        sendLoading.value = false;
      }
    }

    watch(messageText,(liveMessageText) => {
      if(liveMessageText.trim() === '') {
        if(liveMessageText.length === 0) {
          store.addLiveMessage(liveMessageText)
        }
      } else {
        store.addLiveMessage(liveMessageText)
      }

      //
    })

    return {
      messageText,
      sendMessage,
      sendLoading
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


.max-width-box {
  max-width: 1300px;
  width: 100%;
}


.align-box {
  width: 100%;
}
</style>
