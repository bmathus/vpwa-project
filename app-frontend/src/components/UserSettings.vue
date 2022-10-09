<template>
  <q-menu anchor="bottom left" self="top left">
    <q-card class="text-dark">

      <q-card-section class="q-pa-sm my-card">
        <div class="text-subtitle1 text-weight-bold q-ml-sm">User settings</div>
      </q-card-section>
      <q-separator class="q-mx-md" />
      <q-card-section>
        <div class="text-subtitle2">Set Status:</div>
        <div class="text-subtitle2 q-mt-md">Notifications:</div>
      </q-card-section>
      <q-card-section class="column q-pt-none">
        <q-separator />
        <q-btn color="red" outline class="q-mt-sm">Log Out</q-btn>
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'UserSettings',
})
</script>

<style scoped>
.my-card {
  width: 80vw;
  max-width: 250px;
}
</style>