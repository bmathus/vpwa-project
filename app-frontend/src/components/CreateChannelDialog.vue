<template>
  <q-dialog>
    <q-card>
      <q-card-section class="row items-center q-pa-sm">
        <div class="text-subtitle1 text-weight-bold q-ml-sm">Create channel</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section s>
        <q-form @submit.prevent="onSubmit" class="column justify-center area">
          <q-input filled dense v-model="name" label="Name" hint="Enter unique channel name" lazy-rules
            :rules="[(val:any)  => val && val.length > 0 || 'Please type something']" />

          <q-toggle v-model="isPublic" color="steal" keep-color :label="isPublic ? 'Public' :'Private' " />

          <div class="row justify-end items-center">
            <q-btn flat label="Create" type="submit" color="teal" style="display:block" />
          </div>

        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CreateChannelDialog',
  setup() {

    const name = ref('');
    const isPublic = ref(false);

    function onSubmit(): void {

      console.log(name.value)
    }
    return {
      name, onSubmit, isPublic
    }
  }
});
</script>

<style scoped>
.area {
  width: 70vw;
  max-width: 350px;
}

.button-box {
  width: 100%;
}
</style>