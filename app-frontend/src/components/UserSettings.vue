<template>
  <q-menu anchor="bottom left" self="top left">
    <q-card class="text-dark">

      <q-card-section class="q-pa-sm my-card">
        <div class="text-subtitle1 text-weight-bold q-ml-sm">User Settings</div>
      </q-card-section>
      <q-separator class="q-mx-md" />
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-subtitle2">Set Status:</div>
          <q-select dense outlined v-model="option" :options="options" class="status-select"
            :color="setStatusAndColor" />
        </div>
        <div class="q-mt-sm row items-center justify-between">
          <div class="text-subtitle2">Notifications:</div>
          <q-toggle v-model="notifications" color="teal" keep-color left-label
            :label="notifications ? 'All' :'Only for me' " />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none items-end">
        <q-separator />
        <div style="width:100%" class="column justify-center items-end">
          <q-btn color="red" outline class="q-mt-md">Log Out</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useUserStore } from '../stores/userstore';
import { Status } from '../stores/interfaces'

export default defineComponent({
  name: 'UserSettings',
  setup() {
    const userstore = useUserStore()
    const notifications = ref(true);
    const option = ref(userstore.getStatus);

    const options = [
      'online', 'DND', 'offline'
    ];
    const setStatusAndColor = computed(() => {
      if (option.value === 'online') {
        userstore.setStatus(Status.online)
        return 'teal';
      } else if (option.value === 'offline') {
        userstore.setStatus(Status.offline)
        return 'red-4';
      } else {
        userstore.setStatus(Status.DND)
        return 'grey';
      }
    })
    return {
      option, options, setStatusAndColor, notifications
    }
  }
})
</script>

<style scoped>
.my-card {
  width: 80vw;
  max-width: 300px;
}

.status-select {
  width: 100px;
  padding: 0;
}
</style>