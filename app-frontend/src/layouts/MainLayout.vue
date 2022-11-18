<template>
  <q-layout view="lHh Lpr lFf">

    <q-header>
      <toolbar-header @toggledrawer="toggleDrawer" />
    </q-header>

    <left-drawer v-model="drawerVisible" @hide="drawerAfterHidden" />

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer style="background-color:white">
      <message-field />
    </q-footer>

  </q-layout>
</template>

<script lang="ts">

import { ref, defineComponent } from 'vue'
import { useQuasar } from 'quasar';
import ToolbarHeader from '../components/ToolbarHeader.vue';
import LeftDrawer from '../components/LeftDrawer.vue';
import { useChannelStore } from '../stores/channelstore'
//import ChannelPage from '../pages/ChannelPage.vue';
//import NoChannelPage from '../pages/NoChannelPage.vue';
import MessageField from '../components/MessageField.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    ToolbarHeader,
    LeftDrawer,
    MessageField
  },
  setup() {
    const store = useChannelStore();
    const drawerVisible = ref(false);
    const text = ref('');
    const $q = useQuasar();

    //drawer controll
    function toggleDrawer() {
      if (!drawerVisible.value && $q.screen.width <= 750) {
        console.log('stop')
        store.stopMessagesLoading()
        setTimeout(() => {
          drawerVisible.value = !drawerVisible.value;
        }, 20);
      } else {
        drawerVisible.value = !drawerVisible.value;
      }
    }
    function drawerAfterHidden() {
      console.log('resume')
      store.resumeMessagesLoading()
    }

    // const activeComponent = computed(() => {
    //   if (store.channelsAreEmpty) {
    //     return NoChannelPage
    //   } else {
    //     return ChannelPage
    //   }
    // })

    return {
      drawerVisible,
      text,
      toggleDrawer,
      drawerAfterHidden
    }
  },
});
</script>

<style scoped>

</style>
