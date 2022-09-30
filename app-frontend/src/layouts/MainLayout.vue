<template>
  <q-layout view="lHh Lpr lFf">

    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>
          <div class="text-weight-bolder">Channel 1</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawer" side="left" :width="200" :breakpoint="500" bordered class="bg-grey-3">
      <q-scroll-area class="fit">
        <q-list dense>

          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section>
                # {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
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
    separator: true
  },
  {
    label: 'Channel 2',
    separator: false
  },
  {
    label: 'Channel 3',
    separator: false
  },
  {
    label: 'Channel 4',
    separator: true
  },
  {
    label: 'Channel 5',
    separator: false
  },
  {
    label: 'Channel 6',
    separator: false
  },
  {
    label: 'Channel 7',
    separator: false
  }
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