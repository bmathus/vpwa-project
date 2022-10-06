<template>
    <div>
        Messages - {{store.getActiveChannel?.name}}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useChannelStore } from '../stores/channelstore';

export default defineComponent({
    name: 'ChannelPage',
    setup() {
        const store = useChannelStore()
        return {
            store
        }
    }
});
</script>
