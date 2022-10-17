<template>
  <q-menu anchor="bottom left" self="top left">
    <q-card class="text-dark">

      <q-card-section class="q-pa-sm">
        <div class="text-subtitle1 text-weight-bold q-ml-sm">Channel Settings</div>
      </q-card-section>
      <q-separator class="q-mx-md" />

      <q-card-section class="my-card">
        <p class="text-subtitle2 q-mb-md">Leave channel</p>
        <p class="text-caption q-mb-md">After you leave public channel you can join it back with command \join
          channelname
        </p>
        <q-btn color="red" outline>Leave</q-btn>

      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useChannelStore } from '../stores/channelstore';


export default defineComponent({
  name: 'ChannelSettings',
  setup() {
    const store = useChannelStore()
    return {
      store
    }
  }

});
</script>

<style scoped>
.my-card {
  width: 80vw;
  max-width: 300px;
}
</style>