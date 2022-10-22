<template>
  <div class="text-box">
    <textarea placeholder="Message" v-model="messageText" @keyup.enter="sendMessage($event)" />
    <q-btn flat icon="send" color="teal" padding="xs" class="send-btn" @click="sendMessage($event)" />
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref, computed } from 'vue';
import { useChannelStore } from '../stores/channelstore';
import { useUserStore } from '../stores/userstore';

export default defineComponent({
  name: 'MessageField',

  setup() {
    const store = useChannelStore();
    const userstore = useUserStore();
    const messageText = ref('')
    const $q = useQuasar()

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
      }).onOk(() => {
        store.leaveChannel(store.getActiveChannel === null ? null : store.getActiveChannel.id)
        store.resumeMessagesLoading()
      }).onCancel(() => {
        store.resumeMessagesLoading()
        //console.log('>>>> Cancel')
      })
    }

    function notify_err(msg: string) {
      $q.notify({
        type: 'info',
        message: msg,
        color: 'teal',
        timeout: 2500,
      });
    }

    const iamAdmin = computed(() => {
      if (store.getActiveChannel !== null && (store.getActiveChannel.admin_id === userstore.getUser.id)) {
        return true
      } else {
        return false;
      }
    })

    const channelIsPublic = computed(() => {
      if (store.getActiveChannel !== null && store.getActiveChannel.is_public) {
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
    function sendMessage(event: any): void {
      if (!event.shiftKey && messageText.value.trim() !== '') {

        if (messageText.value.includes('/join') && myPermitions.value.includes('join')) {
          let command = messageText.value.split(' ', 4)
          let setpublic: boolean

          if (command.length == 3 && command[2] == 'public\n') {
            setpublic = true
            store.createNewChannel(command[1], setpublic, userstore.getUser, userstore.getStatus)
          }
          else if (command.length == 3 && command[2].toLocaleLowerCase() == 'private\n') {
            setpublic = false
            store.createNewChannel(command[1], setpublic, userstore.getUser, userstore.getStatus)
          }
          else {
            notify_err('Incorrect command')
          }

        }
        if (messageText.value.includes('/cancel') && myPermitions.value.includes('cancel')) {

          if (messageText.value.split(' ', 2).length > 1) {
            notify_err('Incorrect command')
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
        if (messageText.value.includes('/quit') && myPermitions.value.includes('quit')) {
          if (messageText.value.split(' ', 2).length > 1) {
            notify_err('Incorrect command')
          }
          else {
            let message = 'Do you really want to leave this channel? Channel will be deleted'
            confirm(message, 'Quit channel')
          }


        }

        if (messageText.value.includes('/list') && myPermitions.value.includes('list')) {
          store.setActiveMembers()
          store.stopMessagesLoading() //je to spravne?

        }
        if (messageText.value.includes('/revoke') && myPermitions.value.includes('revoke')) {

          let command = messageText.value.split(' ', 3)

          if (command.length == 2) {
            const status = store.revokeMember(command[1].replace('\n', ''))

            if (status == 2) {
              notify_err('Such user doesnt exist in this channel')
            }
          }
          else {
            notify_err('Incorrect command')
          }



        }
        else {
          store.pushMessage(messageText.value, userstore.getUser)

        }
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