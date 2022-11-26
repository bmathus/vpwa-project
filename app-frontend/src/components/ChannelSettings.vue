<template>
  <q-menu anchor="bottom left" self="top left">
    <q-card class="text-dark">

      <q-card-section class="q-pa-sm">
        <div class="text-subtitle1 text-weight-bold q-ml-sm">Channel Settings</div>
      </q-card-section>
      <q-separator class="q-mx-md" />

      <q-card-section class="my-card">
        <p class="text-subtitle2 q-mb-md">{{props.label_text}}</p>
        <p class="text-caption q-mb-md">
          {{props.text_info}}
        </p>
        <div>
          <q-btn color="red" outline @click="leaveChannel" v-close-popup>{{props.button_title}}</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script setup lang="ts">

import { useChannelStore } from '../stores/channelstore';
import { useQuasar } from 'quasar';

const props = defineProps<{
  button_title: string,
  text_info: string,
  label_text: string
}>()

const store = useChannelStore();
const $q = useQuasar();

async function leaveChannel() {
  const result = await store.leaveChannel()

  $q.notify({
    type: 'info',
    message: result,
    color: 'teal',
    timeout: 2500,
  });

}

</script>

<style scoped>
.my-card {
  width: 80vw;
  max-width: 300px;
}
</style>
