<template>
  <q-layout view="lHh Lpr lFf">

    <q-header>
      <toolbar-header @drawer="drawerVisible = !drawerVisible" />
    </q-header>

    <left-drawer v-model="drawerVisible" />

    <q-page-container>
      <component :is="activeComponent"></component>
    </q-page-container>

    <q-footer style="background-color:white">
      <message-field />
    </q-footer>

  </q-layout>
</template>

<script lang="ts">

import { ref, defineComponent, computed } from 'vue'

import ToolbarHeader from '../components/ToolbarHeader.vue';
import LeftDrawer from '../components/LeftDrawer.vue';
import { useChannelStore } from '../stores/channelstore'
import ChannelPage from '../pages/ChannelPage.vue';
import NoChannelPage from '../pages/NoChannelPage.vue';
import MessageField from '../components/MessageField.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    ToolbarHeader,
    LeftDrawer,
    MessageField
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

</style>