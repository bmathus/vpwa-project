<template>
  <q-drawer show-if-above side="left" :width="225" :breakpoint="600" class="bg-grey-3">
    <div class="absolute-top row items-center" style="height:50px;">
      <q-btn unelevated color="primary" padding="none" style="height:32px; width:32px" label="M" class="q-ma-sm"
        text-color="black">
        <q-badge color="green" class="absolute-bottom-right badge-style" rounded />
      </q-btn>
      <div class="text-subtitle2 text-weight-bolder">User Name</div>
      <q-separator class="absolute-bottom"></q-separator>
    </div>



    <q-scroll-area style="height: calc(100% - 50px); margin-top: 50px;">
      <q-list dense>

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

    <div class="absolute-bottom">
      <q-separator></q-separator>
      <q-item dense clickable v-ripple>
        <q-item-section class="text-subtitle2">
          Add Channel
        </q-item-section>
        <q-item-section side>
          <q-icon name="add" size="20px" style="margin-right: 2px;" />
        </q-item-section>
      </q-item>
    </div>

  </q-drawer>

</template>

<script lang="ts">
import { defineComponent } from 'vue'

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

export default defineComponent({
  name: 'LeftDrawer',
  setup() {
    return {
      menuList,
    }
  }
});
</script>

<style scoped>
.badge-style {
  margin: 0px -2px -2px 0px;
  border-style: solid;

  border-color: rgb(50, 50, 50);
  height: 15px;
}
</style>