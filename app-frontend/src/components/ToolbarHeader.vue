<template>
    <q-toolbar class="bg-dark text-white">
        <q-btn dense flat round icon="menu" @click="drawerVisibility" />
        <q-toolbar-title class="row">
            <q-btn flat dense no-caps color="white" size="16px" padding="2px 6px" v-if="!store.channelsAreEmpty">
                <div class="text-weight-bold">{{store.getActiveChannel?.name}}</div>
                <q-icon name="expand_more" size="18px" />
                <channel-setting v-if="userIsAdmin()" :text_info="quitinfo" button_title="Quit"
                    label_text="Quit channel" />
                <channel-setting v-else :text_info="leaveinfo" button_title="Leave" label_text="Leave channel" />
            </q-btn>
        </q-toolbar-title>
        <q-btn dense flat @click="toggleDialog" v-if="!store.channelsAreEmpty">
            <q-icon name="group" class="q-mr-xs" />
            <div class="text-subtile2">{{store.getActiveChannelMembers.length}}</div>
        </q-btn>
    </q-toolbar>
    <members-dialog v-model="store.active_dialog" @hide="whenDialogCloses">
    </members-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useChannelStore } from '../stores/channelstore';
import { useUserStore } from '../stores/userstore';
import MembersDialog from './MembersDialog.vue';
import ChannelSetting from './ChannelSettings.vue'


export default defineComponent({
    name: 'ToolbarHeader',
    emits: ['drawer'],
    components: {
        MembersDialog,
        ChannelSetting
    },
    setup(props, { emit }) {
        const store = useChannelStore()
        const userstore = useUserStore();

        const leaveinfo = 'After you leave channel you can join it back or need to receive an invitation.'
        const quitinfo = 'After you quit channel it will be completely removed.';

        function userIsAdmin(): boolean {
            if (store.getActiveChannel !== null && store.getActiveChannel.admin_id == userstore.getUser.id) {
                return true
            } else {
                return false
            }
        }

        function toggleDialog(): void {
            store.stopMessagesLoading()

            setTimeout(() => {
                store.setActiveMembers()
            }, 20)
        }

        function whenDialogCloses(): void {
            store.resumeMessagesLoading
        }

        function drawerVisibility(): void {
            emit('drawer')
        }
        return { drawerVisibility, toggleDialog, store, leaveinfo, quitinfo, userIsAdmin, whenDialogCloses }
    }
});

</script>