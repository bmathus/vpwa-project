<template>
  <q-menu flat anchor="center middle" self="top right">
    <q-card flat>
      <q-card-section>
        <p class="text-subtitle2">{{"@"+ invitation.sender.nickname + " invites you to this channel."}}</p>
        <q-separator />
        <div style="width:100%" class="row">
          <q-btn color="teal" outline class="q-mt-md q-mr-md" @click="resolveInvitation('accept')" v-close-popup>Accept</q-btn>
          <q-btn color="red" outline class="q-mt-md" @click="resolveInvitation('decline')" v-close-popup>Decline</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userstore';
import { Invitation } from '../contracts'

const props = defineProps<{
  invitation: Invitation
}>()

const userstore = useUserStore()

async function resolveInvitation(action: 'accept'|'decline') {
  await userstore.resolveInvitation(props.invitation,action)
}

</script>

<style scoped>

</style>
