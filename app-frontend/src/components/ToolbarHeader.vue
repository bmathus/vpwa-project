<template>
    <q-toolbar class="bg-dark text-white">
        <q-btn dense flat round icon="menu" @click="drawerVisibility" />
        <q-toolbar-title class="row">
            <q-btn flat dense no-caps color="white" size="16px" padding="2px 6px"
                v-if="store.getActiveChannel !== null">
                <div class="text-weight-bold">{{store.getActiveChannel?.name}}</div>
                <q-icon name="expand_more" size="18px" />
            </q-btn>
        </q-toolbar-title>
        <q-btn dense flat @click="toggleDialog">
            <q-icon name="group" class="q-mr-xs" />
            <div class="text-subtile2">26</div>
        </q-btn>
    </q-toolbar>
    <members-dialog v-model="openDialog"></members-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useChannelStore } from '../stores/channelstore';

import MembersDialog from './MembersDialog.vue';

export default defineComponent({
    name: 'ToolbarHeader',
    emits: ['drawer'],
    components: {
        MembersDialog
    },
    setup(props, { emit }) {
        const store = useChannelStore()
        const openDialog = ref(false)

        function toggleDialog(): void {
            openDialog.value = !openDialog.value;
        }

        function drawerVisibility(): void {
            emit('drawer')
        }
        return { drawerVisibility, openDialog, toggleDialog, store }
    }
});

</script>