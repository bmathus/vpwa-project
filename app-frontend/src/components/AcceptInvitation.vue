<template>
  <q-menu flat anchor="center middle" self="top right">
    <q-card flat>
      <q-card-section>
        <p class="text-subtitle2">Aceept invite to this channel?</p>
        <q-separator />
        <div style="width:100%" class="row">
          <q-btn color="teal" outline class="q-mt-md q-mr-md" @click="acceptInvitation" v-close-popup>Accept</q-btn>
          <q-btn color="red" outline class="q-mt-md" @click="declineInvitation" v-close-popup>Decline</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '../stores/userstore';

export default defineComponent({
  name: 'AcceptInvitation',
  props: {
    channel_id : Number},
  setup(props) {

    const userstore = useUserStore()

    function acceptInvitation(): void {
      console.log('accepted');
    }

    function declineInvitation(): void {
      console.log(props.channel_id)
      userstore.declineInvitation(props.channel_id)
    }
    return {
      acceptInvitation,
      declineInvitation
    }
  }
});
</script>

<style scoped>

</style>