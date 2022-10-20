<template>
  <q-dialog>
    <q-card>
      <q-card-section class="row items-center q-pa-sm">
        <div class="text-subtitle1 text-weight-bold q-ml-sm">Channel Members</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="resumeMessagesLoading" />
      </q-card-section>

      <q-separator class="q-mx-md" />

      <q-scroll-area class="area">
        <q-list>
          <q-item dense v-for="member in store.active_channel.members" :key="member.name">
            <q-item-section avatar>
              <q-avatar rounded :color="member.avatarColor" text-color="dark" class="q-my-xs"
                style="height:38px; width:38px">
                <div>{{member.name[0].toUpperCase()}}</div>
                <activity-badge :status="member.status" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              {{member.name}}
            </q-item-section>

          </q-item>
        </q-list>
      </q-scroll-area>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ActivityBadge from './ActivityBadge.vue'
import { useChannelStore } from '../stores/channelstore';


export default defineComponent({
  name: 'MembersDialog',
  components: {
    ActivityBadge
  },
  setup() {
    const store = useChannelStore()
    function resumeMessagesLoading() {
      store.resumeMessagesLoading()
    }
    return {
      resumeMessagesLoading,
      store
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

.area {
  height: 45vh;
  max-height: 400px;
  width: 80vw;
  max-width: 350px;
  margin-top: 8px;
}
</style>