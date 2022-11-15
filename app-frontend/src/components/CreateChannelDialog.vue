<template>
  <q-dialog>
    <q-card>
      <q-card-section class="q-pa-sm row items-center">
        <div class="text-subtitle1 text-weight-bold q-ml-sm">Create channel</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-separator class="q-mx-md" />

      <q-card-section s>
        <q-form @submit.prevent="onSubmit" class="column justify-center area">
          <q-input filled dense v-model="name" label="Channel name" hint="Enter unique channel name" lazy-rules :rules="[(val: any) => val && val.length > 0 || 'Name must be at least 1 character', (val: any) => val && val.length <= 20 || 'Name is too long',
          (val: any) => val && !val.includes('/') || 'Cannot create channel with special characters']" />

          <q-toggle v-model="isPublic" color="teal" keep-color :label="isPublic ? 'Public' : 'Private'" />
          <q-separator />
          <div class="row justify-end items-center q-mt-sm">
            <q-btn flat label="Create" type="submit" color="teal" style="display:block" />
          </div>

        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useChannelStore } from 'src/stores/channelstore';
import { useUserStore } from '../stores/userstore';

export default defineComponent({
  name: 'CreateChannelDialog',
  emits: ['dialogVisibility'],
  setup(props, ctx) {
    const store = useChannelStore()
    const userstore = useUserStore()
    const name = ref('');
    const isPublic = ref(false);

    function onSubmit(): void {
      store.createNewChannel(name.value,isPublic.value,userstore.getUserNickname,userstore.getUserAvatarColor,userstore.getStatus)
      ctx.emit('dialogVisibility');
      name.value = '';
    }
    function closeDialog() {
      ctx.emit('dialogVisibility');
    }
    return {
      name, onSubmit, isPublic, store, closeDialog
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
