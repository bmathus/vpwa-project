<template>

  <q-drawer show-if-above side="left" :width="225" :breakpoint="600" class="bg-grey-3">
    <div class="absolute-top row items-center" style="height:50px;">
      <q-btn unelevated color="primary" padding="none" style="height:32px; width:32px" label="M" class="q-ma-sm"
        text-color="black">
        <activity-badge status="online" />
        <user-settings></user-settings>
      </q-btn>
      <div column v-if="userstore.user.nickname == null">
        <div class="text-subtitle2 text-weight-bolder">Dsafagfadg</div>
        <div class="text-subtitle2 text-weight-light">Janko Hrasko</div>
      </div>
      <div column v-else>
        <div class="text-subtitle2 text-weight-bolder">{{userstore.user.nickname}}</div>
        <div class="text-subtitle1">{{userstore.user.name}} {{userstore.user.surname}}</div>
      </div>

      <q-separator class="absolute-bottom"></q-separator>
    </div>

    <q-scroll-area style="height: calc(100% - 50px); margin-top: 50px;">
      <q-list dense>

        <q-expansion-item dense dense-toggle expand-separator label="Invitations" default-opened class="text-subtitle2">
          <template v-for="invite in userstore.getInvitations" :key="invite.id">
            <q-item dense clickable>
              <q-item-section :channel_id="invite.id" class="text-subtitle2">

                # {{ invite.channel_name }}
              </q-item-section>
              <accept-invitation :invitation="invite" />
            </q-item>
          </template>
        </q-expansion-item>

        <q-expansion-item dense dense-toggle expand-separator label="Private Channels" default-opened
          class="text-subtitle2">
          <template v-for="channel in store.getPrivateChannels" :key="channel.id">
            <q-item dense clickable v-ripple @click="store.setActiveChannel(channel)">
              <q-item-section class="text-subtitle2">
                # {{ channel.name }}
              </q-item-section>

            </q-item>
          </template>
        </q-expansion-item>

        <q-expansion-item dense dense-toggle expand-separator label="Public Channels" default-opened
          class="text-subtitle2">
          <template v-for=" channel in store.getPublicChannels" :key="channel.id">
            <q-item dense clickable v-ripple @click="store.setActiveChannel(channel)">
              <q-item-section class="text-subtitle2">
                # {{ channel.name }}
              </q-item-section>

            </q-item>
          </template>
        </q-expansion-item>

      </q-list>
    </q-scroll-area>

    <div class="absolute-bottom bg-grey-3">
      <q-separator />
      <q-item dense clickable v-ripple @click="toggleDialog">
        <q-item-section class="text-subtitle2">
          Create Channel
        </q-item-section>
        <q-item-section side>
          <q-icon name="add" size="20px" style="margin-right: 2px;" />
        </q-item-section>
      </q-item>
    </div>
    <create-channel-dialog v-model="openDialog" @dialogVisibility="toggleDialog" />
  </q-drawer>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ActivityBadge from './ActivityBadge.vue';
import CreateChannelDialog from './CreateChannelDialog.vue';
import { useChannelStore } from 'src/stores/channelstore';
import { useUserStore } from '../stores/userstore';
import UserSettings from './UserSettings.vue';
import AcceptInvitation from './AcceptInvitation.vue';


export default defineComponent({
  name: 'LeftDrawer',
  components: {
    ActivityBadge,
    CreateChannelDialog,
    UserSettings,
    AcceptInvitation
  },
  setup() {
    const store = useChannelStore();
    const userstore = useUserStore();
    const openDialog = ref(false);

    function toggleDialog(): void {
      openDialog.value = !openDialog.value;
    }
    return {
      toggleDialog,
      openDialog,
      store,
      userstore
    }
  }

});
</script>

