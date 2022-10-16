<template>
   
   <q-menu touch-position context-menu>
  
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="onClick()">Leave {{name}}? </q-item-section>
            </q-item>
    
          </q-list>
    </q-menu>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useChannelStore } from 'src/stores/channelstore';

export default defineComponent({
  name: 'ChannelMenu',
  props: {
    name: String,
    id: Number
  },
  setup(props) {
    const store = useChannelStore()

    function onClick(): void {
        store.deleteTargetChannel(props.id)
    }
    return {
      onClick,
      store
    }
  }
 
});
</script>