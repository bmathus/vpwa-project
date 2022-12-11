<template>
  <q-menu anchor="bottom left" self="top left">
    <q-card class="text-dark">

      <q-card-section class="q-pa-sm my-card">
        <div column class="text-subtitle1 text-weight-bold q-ml-sm">
          {{userstore.getUserFullName}}
        </div>

      </q-card-section>
      <q-separator class="q-mx-md" />
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-subtitle2">Set Status:</div>
          <div class="row items-center">
            <q-spinner v-if="statusLoading" color="teal" size="xs" :thickness="6"/>
            <q-select dense outlined :disable="statusLoading" v-model="selectedStatus" :options="options" class="status-select q-ml-sm" :color="setStatusAndColor"/>
          </div>

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
          <q-btn color="red" outline class="q-mt-md" @click="logout">
            <div :class="{'q-mr-sm':loading}">Logout</div>
            <q-spinner v-if="loading" color="red" size="xs" :thickness="4" />
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useUserStore } from '../stores/userstore';
import { Status } from '../contracts'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'UserSettings',
  setup() {
    const userstore = useUserStore()
    const notifications = ref(true);
    const selectedStatus = ref(userstore.getStatus);
    const $router = useRouter();
    const statusLoading = ref(false)

    const options = [
      'online', 'DND', 'offline'
    ];

    const setStatusAndColor = computed(() => {
      if (selectedStatus.value === 'online') {
        return 'teal';
      } else if (selectedStatus.value === 'offline') {
        return 'red-4';
      } else {
        return 'grey';
      }
    })

    watch(selectedStatus,async (newStatus) => {
      statusLoading.value = true
      await userstore.setStatus(newStatus)
      statusLoading.value = false
    })

    const loading = computed((): boolean => {
      return userstore.auth_status === 'pending';
    })

    function logout() {
      userstore.logout()
        .then(() => {
          $router.push({ name: 'login' })
        })

    }
    return {
      selectedStatus, options, setStatusAndColor, notifications, userstore,logout,loading, statusLoading
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
