<template>
  <div class="aligh-box column justify-center items-center">
    <div class="max-width-box">
      <div v-if="openLiveTyping && shownMember"
        class="livetyping-box text-black q-mx-md text-dark text-caption bg-teal-1 q-pb-sm">
        <div class="inner-box q-px-sm">
          <div class="close-badge bg-white" @click="hideLiveTyping">
            <q-icon class="row" name="close" color="teal" />
          </div>
          <span class="text-weight-medium">{{ shownMember.nickname + ':' }}</span>
          {{ shownMember.live_text }}
        </div>
      </div>

      <div class="nowtyping-box q-mx-md q-pb-xs q-px-xs text-dark bg-white text-weight-medium text-caption"
        v-if="membersTyping.length !== 0">
        <button v-for="member in membersTyping" :key="member.id" @click="showLiveTyping(member)">
          {{ prepareButtonLabel(member.nickname) }}
        </button>
        <div class="q-ml-xs">{{ typingText }}</div>
      </div>
      <div class="text-box">
        <textarea placeholder="Message" v-model="messageText" @keyup.enter="sendMessage($event)" />
        <q-btn flat icon="send" color="teal" padding="xs" class="send-btn" @click="sendMessage($event)" />
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref, computed, watch } from 'vue';
import { useChannelStore } from '../stores/channelstore';
import { useUserStore } from '../stores/userstore';
import { Member } from '../stores/interfaces';

export default defineComponent({
  name: 'MessageField',

  setup() {
    const store = useChannelStore();
    const userstore = useUserStore();
    const messageText = ref('')
    const $q = useQuasar();


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

    function notify_event(msg: string) {
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

          let command = messageText.value.split(' ')
          let message_join = messageText.value.split(' ').slice(1)
          message_join.splice(-1, 1)

          let channel_name = message_join.join(' ')
          let duplicate = store.checkDuplicateChannel(channel_name)

          if (!channel_name.includes('/') && duplicate == 1 && command[0] == '/join' && channel_name.length <= 20 && messageText.value.split(' ').pop() == '\[public\]\n') {
            let setpublic = true
            store.createNewChannel(channel_name, setpublic, userstore.getUser, userstore.getStatus)
            notify_event('Public channel ' + channel_name + ' was created')
          }
          else if (!channel_name.includes('/') && duplicate == 1 && command[0] == '/join' && channel_name.length <= 20 && messageText.value.split(' ').pop() == '\[private\]\n') {
            let setpublic = false
            store.createNewChannel(channel_name, setpublic, userstore.getUser, userstore.getStatus)
            notify_event('Private channel ' + channel_name + ' was created')
          }
          else {

            if (channel_name.includes('/')) {
              notify_event('Cannot create channel with special characters')
            }

            else if (duplicate == 2) {
              notify_event('Cannot create channel that already exists')
            }
            else {
              notify_event('Incorrect command')
            }

          }

        }
        else if (messageText.value.includes('/cancel') && myPermitions.value.includes('cancel')) {

          if (messageText.value.split(' ', 2).length > 1) {
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
        else if (messageText.value.includes('/quit') && myPermitions.value.includes('quit')) {
          if (messageText.value.split(' ', 2).length > 1) {
            notify_event('Incorrect command')
          }
          else {
            let message = 'Do you really want to leave this channel? Channel will be deleted'
            confirm(message, 'Quit channel')
          }


        }

        else if (messageText.value.includes('/list') && myPermitions.value.includes('list')) {
          if (messageText.value.length == 6)
            store.toogleMembersDialog()
          else {
            notify_event('Incorrect command')
          }
        }
        else if (messageText.value.includes('/revoke') && myPermitions.value.includes('revoke')) {

          let command = messageText.value.split(' ', 2)

          if (command[0] == '/revoke') {

            if (command[1].replace('\n', '') == userstore.getUser.nickname) {
              notify_event('You cannot throw yourself out of the channel')
            }

            else {
              const status = store.makeRevoke(command[1].replace('\n', ''))

              if (status == 2) {
                notify_event('Such user doesnt exist in this channel')
              }
            }


          }
          else {
            notify_event('Incorrect command')
          }

        }
        else if (messageText.value.includes('/kick') && myPermitions.value.includes('kick')) {
          let command = messageText.value.split(' ', 2)

          if (command[0] == '/kick') {

            if (command[1].replace('\n', '') == userstore.getUser.nickname) {
              notify_event('You cannot kick yourself out of the channel')
            }

            else {
              const status = store.makeRevoke(command[1].replace('\n', ''))

              if (status == 1) {
                notify_event('You kicked member ' + command[1])
              }

              if (status == 2) {
                notify_event('Such user doesnt exist in this channel')
              }

            }

          }
          else {
            notify_event('Incorrect command')
          }
        }
        else if (messageText.value.includes('/invite') && myPermitions.value.includes('invite')) {
          let command = messageText.value.split(' ', 2)

          if (command[0] == '/invite') {
            notify_event('You invited user X')

          }
          else {
            notify_event('Incorrect command')
          }
        }

        else {
          store.pushMessage(messageText.value, userstore.getUser)

        }
        messageText.value = ''
      }
    }

    //live typing code
    const openLiveTyping = ref(false);
    const shownMember = ref();

    const activeChannel = computed(() => {
      return store.getActiveChannel;
    })


    const membersTyping = computed(() => {
      return store.getActiveChannelMembers.filter((member) => {
        //chceme zobrazit len memberov ktory maju prazdny live text string a niesom tam ani ja prihlaseny user
        if (member.live_text.length !== 0 && member.id !== userstore.getUser.id) {
          return member
        }
      })
    })

    function prepareButtonLabel(nickname: string): string {
      if (nickname !== membersTyping.value[membersTyping.value.length - 1].nickname) {
        return nickname + ', '
      } else {
        return nickname
      }
    }
    const typingText = computed(() => {
      if (membersTyping.value.length > 1) {
        return 'are typing...'
      } else {
        return 'is typing...'
      }
    })

    function showLiveTyping(member: Member): void {
      shownMember.value = member;
      openLiveTyping.value = true;
    }

    function hideLiveTyping(): void {
      openLiveTyping.value = false;
    }

    //keby prepnem channel tak aby sa zatvoril live typing box
    watch(activeChannel, () => {
      hideLiveTyping()
    });



    return {
      messageText,
      sendMessage,
      membersTyping,
      prepareButtonLabel,
      typingText,
      openLiveTyping,
      showLiveTyping,
      hideLiveTyping,
      shownMember
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


/* live typing classes */
.nowtyping-box,
.livetyping-box {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.nowtyping-box {
  border: solid 2px teal;
  margin-top: -10px;
}

.nowtyping-box button {
  border: none;
  background-color: transparent;
  padding: 0px;
  cursor: pointer;
  transition: all 0.1s ease-in;
}

.nowtyping-box button:hover {
  color: teal;
}

.nowtyping-box button:active {
  transform: translateY(2px);
}

.nowtyping-box div {
  display: inline-block;
}

.livetyping-box {
  border: solid 2px teal;
}

.close-badge {
  cursor: pointer;
  position: absolute;
  right: 1px;
  top: 1px;
  display: inline-block;
  border-radius: 8px;
  padding: 1px;
  border: solid 1px teal;
  transition: all 0.1s ease-in;
}

.inner-box {
  max-height: 200px;
  overflow: auto;
  position: relative;
}

.close-badge:active {
  transform: translateY(1px);
}

.max-width-box {
  max-width: 1300px;
  width: 100%;
}


.align-box {
  width: 100%;
}
</style>