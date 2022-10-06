<template>
  <q-layout view="lHh Lpr lFf">

    <q-header>
      <toolbar-header @drawer="drawerVisible = !drawerVisible" />
    </q-header>

    <left-drawer v-model="drawerVisible" />

    <q-page-container>
      <component :is="activeComponent"></component>
    </q-page-container>

    <q-footer style="background-color:transparent" class="row">
      <div class="text-box">
        <textarea placeholder="Message"></textarea>
        <q-btn flat icon="send" color="teal" padding="xs" class="send-btn" />
      </div>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">

import { ref, defineComponent, computed } from 'vue'

import ToolbarHeader from '../components/ToolbarHeader.vue';
import LeftDrawer from '../components/LeftDrawer.vue';
import { useChannelStore } from '../stores/channelstore'
import ChannelPage from '../pages/ChannelPage.vue';
import NoChannelPage from '../pages/NoChannelPage.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    ToolbarHeader,
    LeftDrawer
  },
  setup() {
    const store = useChannelStore()

    store.fetchChannels()

    const drawerVisible = ref(false)
    const text = ref('')
    const activeComponent = computed(() => {
      if (store.channelsAreEmpty) {
        return NoChannelPage
      } else {
        return ChannelPage
      }
    })

    return {
      drawerVisible,
      text,
      activeComponent
    }
  }
});
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
  margin: 14px 10px 14px 14px;
}

.text-box button {
  margin: 0px 14px 14px 0px;
}

.send-btn {
  position: absolute;
  bottom: 5px;
  right: 4px;
}
</style>