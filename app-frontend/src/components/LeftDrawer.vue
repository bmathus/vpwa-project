<template>
  <q-drawer show-if-above side="left" :width="225" :breakpoint="600" class="bg-grey-3">
    <div class="absolute-top row items-center" style="height:50px;">
      <q-btn unelevated color="primary" padding="none" style="height:32px; width:32px" label="M" class="q-ma-sm"
        text-color="black">
        <activity-badge status="online" />
      </q-btn>
      <div class="text-subtitle2 text-weight-bolder">User Name</div>
      <q-separator class="absolute-bottom"></q-separator>
    </div>

    <q-scroll-area style="height: calc(100% - 50px); margin-top: 50px;">
      <q-list dense>

        <q-expansion-item dense dense-toggle expand-separator label="Invitations" default-opened class="text-subtitle2">
          <template v-for="(item, index) in invitationsList" :key="index">
            <q-item dense :active="item.label === 'Outbox'">
              <q-item-section class="text-subtitle2">
                # {{ item.label }}
              </q-item-section>
              <q-item-section side>
                <div class="row items-center justify-center">
                  <q-badge outline color="teal">
                    <q-icon name="check" color="teal" />
                  </q-badge>
                  <q-badge outline color="red" class="q-ml-xs">
                    <q-icon name="close" color="red" />
                  </q-badge>
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-expansion-item>

        <q-expansion-item dense dense-toggle expand-separator label="Private Channels" default-opened
          class="text-subtitle2">
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item dense clickable :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section class="text-subtitle2">
                # {{ menuItem.label }}
              </q-item-section>
            </q-item>
          </template>
        </q-expansion-item>

        <q-expansion-item dense dense-toggle expand-separator label="Public Channels" default-opened
          class="text-subtitle2">
          <template v-for=" (menuItem, index) in menuList" :key="index">
            <q-item dense clickable :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section class="text-subtitle2">
                # {{ menuItem.label }}
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
    <create-channel-dialog v-model="openDialog" />
  </q-drawer>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ActivityBadge from './ActivityBadge.vue';
import CreateChannelDialog from './CreateChannelDialog.vue';

const menuList = [
  {
    label: 'Channel 1',
  },
  {
    label: 'Channel 2',
  },
  {
    label: 'Channel 3',
  },
  {
    label: 'Channel 4',
  },
  {
    label: 'Channel 5',
  },
  {
    label: 'Channel 6',
  },
  {
    label: 'Channel 7',
  },
  {
    label: 'Channel 5',
  },
  {
    label: 'Channel 6',
  },
]

const invitationsList = [
  {
    label: 'DBS channel'
  },
  {
    label: 'IAU 2022/23'
  }
]

export default defineComponent({
  name: 'LeftDrawer',
  components: {
    ActivityBadge,
    CreateChannelDialog
  },
  setup() {
    const openDialog = ref(false)

    function toggleDialog(): void {
      openDialog.value = !openDialog.value;
    }
    return {
      menuList,
      invitationsList,
      toggleDialog,
      openDialog
    }
  }

});
</script>
