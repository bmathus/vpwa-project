<template>

  <q-drawer show-if-above side="left" :width="225" :breakpoint="750" class="bg-grey-3">
    <div class="absolute-top row items-center" style="height:50px;">
      <q-btn unelevated :color="userstore.getUser.avatar_color" padding="none" style="height:32px; width:32px"
        :label="userstore.getUser.nickname[0].toUpperCase()" class="q-ma-sm" text-color="black">
        <activity-badge :status="userstore.getStatus" />
        <user-settings></user-settings>
      </q-btn>
      <div class="text-subtitle2 text-weight-bolder">{{ userstore.getUser.nickname }}</div>
      <q-separator class="absolute-bottom"></q-separator>
    </div>

    <q-scroll-area style="height: calc(100% - 50px); margin-top: 50px;">
      <q-list dense>

        <q-expansion-item dense dense-toggle expand-separator label="Invitations" default-opened class="text-subtitle2">
          <template v-for="invite in userstore.getInvitations" :key="invite.id">
            <q-item dense clickable>
              <q-item-section :channel_id="invite.id" class="text-subtitle2">
                <div row>

                  <q-icon name="mail" size="18px" />
                  {{ invite.channel_name }}
                </div>
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
                <div row>

                  <q-icon v-if="channel.admin" name="star" size="18px" />
                  <q-icon v-else class="material-icons-outlined" name="label" size="18px" />
                  {{ channel.name }}
                </div>
              </q-item-section>

            </q-item>
          </template>
        </q-expansion-item>

        <q-expansion-item dense dense-toggle expand-separator label="Public Channels" default-opened
          class="text-subtitle2">
          <template v-for=" channel in store.getPublicChannels" :key="channel.id">
            <q-item dense clickable v-ripple @click="store.setActiveChannel(channel)">
              <q-item-section class="text-subtitle2">
                <div row>

                  <q-icon v-if="channel.admin" name="star" size="18px" />
                  <q-icon v-else name="label" size="18px" />
                  {{ channel.name }}
                </div>

              </q-item-section>

            </q-item>
          </template>
        </q-expansion-item>

      </q-list>
    </q-scroll-area>

    <div class="absolute-bottom bg-grey-3">
      <q-separator />
      <q-item dense clickable v-ripple @click="showDialog">
        <q-item-section class="text-subtitle2">
          Create Channel
        </q-item-section>
        <q-item-section side>
          <q-icon name="add" size="20px" style="margin-right: 2px;" />
        </q-item-section>
      </q-item>
    </div>
    <create-channel-dialog v-model="dialogIsOpen" @dialogVisibility="hideDialog" />
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
    const dialogIsOpen = ref(false);


    function hideDialog(): void {
      dialogIsOpen.value = false;
      if (!store.channelsAreEmpty) {
        setTimeout(() => {
          store.resumeMessagesLoading()
        }, 20);
      }

    }
    function showDialog(): void {
      if (!store.channelsAreEmpty) {
        store.stopMessagesLoading()
      }
      setTimeout(() => {
        dialogIsOpen.value = true;
      }, 20);
    }
    return {
      showDialog,
      hideDialog,
      dialogIsOpen,
      store,
      userstore
    }
  }

});
</script>

