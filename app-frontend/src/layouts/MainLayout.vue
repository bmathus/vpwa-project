<template>
  <q-layout view="lHh Lpr lFf">

    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>
          <div class="text-h6">Channel 1</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawer" side="left" :width="200" :breakpoint="500" class="bg-grey-3">

      <div class="absolute-top row items-center" style="height:50px;">
        <q-btn unelevated color="primary" padding="none" style="height:32px; width:32px" label="M" class="q-ma-sm"
          text-color="black">
          <q-badge color="green" class="absolute-bottom-right badge-position" rounded />
        </q-btn>
        <div class="text-weight-bold">User Name</div>
        <q-separator class="absolute-bottom"></q-separator>
      </div>

      <q-scroll-area style="height: calc(100% - 50px); margin-top: 50px;">
        <q-list dense>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section>
                # {{ menuItem.label }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <div class=" bg-amber">
        textbox will be here
      </div>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

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
  {
    label: 'Channel 7',
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
  name: 'MainLayout',
  setup() {
    const drawer = ref(false)

    return {
      drawer,
      menuList
    }
  }
});
</script>

<style scoped>
.badge-position {
  margin: 0px -2px -2px 0px
}
</style>