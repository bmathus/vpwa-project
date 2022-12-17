<template>
  <div v-if="shownSender"
    class="livetyping-box text-black q-mx-md text-dark text-caption bg-teal-1 q-pb-sm">
    <div class="inner-box q-px-sm">
      <div class="close-badge bg-white" @click="hideBoxVisibility">
        <q-icon class="row" name="close" color="teal" />
      </div>
      <span class="text-weight-medium">{{ shownSender + ':' }}</span>
      {{ liveMessages[shownSender] }}
    </div>
  </div>

  <div class="nowtyping-box q-mx-md q-pb-xs q-px-xs text-dark bg-white text-weight-medium text-caption"
    v-if="Object.keys(liveMessages).length !== 0">
    <button v-for="[index,[sender,]] of Object.entries(Object.entries(liveMessages))" :key="index" @click="triggerBoxVisibility(sender)">
      {{prepareButtonLabel(sender,index)}}
    </button>
    <div class="q-ml-xs">{{typingText}}</div>
  </div>
</template>

<script lang="ts">
import { useChannelStore } from 'src/stores/channelstore';
import { defineComponent,ref,computed, watch } from 'vue'


export default defineComponent({
  name: 'LiveTyping',
  setup() {
    //live typing code
    const store = useChannelStore()
    const shownSender = ref();

    const activeChannel = computed(() => {
      return store.getActiveChannel;
    })

    const liveMessages = computed(() => {
      if(activeChannel.value !== null) {
        return store.channels_messages[activeChannel.value.name].liveMessages
      }
      return {}
    })

    watch(liveMessages,(newLiveMessages) => {
      if(!(shownSender.value in newLiveMessages)) {
        shownSender.value = null;
      }

    },{deep: true})

    function prepareButtonLabel(nickname: string, index: string): string { //dava za meno čiarku alebo nie
      if ((Object.keys(liveMessages.value).length - 1) !== parseInt(index)) {
        return nickname + ', '
      } else {
        return nickname
      }
    }

    const typingText = computed(() => { //iba vracia are alebo is podla toho kolko memberov píše
      if (Object.keys(liveMessages.value).length > 1) {
        return 'are typing...'
      } else {
        return 'is typing...'
      }
    })

    //otvorenie zatvorenie live typing boxu konkretneho použivatela
    function triggerBoxVisibility(sender: string): void {
      if(shownSender.value == null) {
        shownSender.value = sender;
      } else {
        if(sender === shownSender.value) {
          shownSender.value = null
        } else {
          shownSender.value = sender
        }
      }
    }

    //zatvorenie live typing boxu konkretneho použivatela
    function hideBoxVisibility(): void {
      shownSender.value = null;
    }

    //keby prepnem channel tak aby sa skryl live typing box
    watch(activeChannel, () => {
      hideBoxVisibility()
    });


    return {
      triggerBoxVisibility,
      typingText,
      prepareButtonLabel,
      liveMessages,
      shownSender,
      hideBoxVisibility,
    }
  }
});
</script>

<style scoped>

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
  overflow-wrap: break-word;
  position: relative;
}

.close-badge:active {
  transform: translateY(1px);
}

</style>
