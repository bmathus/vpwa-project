<template>
  <q-dialog>
    <q-card>
      <q-card-section class="row items-center q-pa-sm">
        <div class="text-subtitle1 text-weight-bold q-ml-sm">Channel Members</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-scroll-area class="area">
        <q-list>
          <q-item dense v-for="member in channelMembersList" :key="member.name">
            <q-item-section avatar>
              <q-avatar rounded :color="member.avatarColor" text-color="dark" class="q-my-xs">
                <div>{{member.name[0].toUpperCase()}}</div>
                <q-badge :color="getMemberStatus(member)" class="absolute-bottom-right badge-style" rounded>
                </q-badge>
              </q-avatar>
            </q-item-section>
            <q-item-section>{{member.name}}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

type Member = {
  name: string,
  avatarColor: string,
  status: string
}

const channelMembersList: Member[] = [
  {
    name: 'Matus',
    avatarColor: 'primary',
    status: 'online'
  },
  {
    name: 'Jozef',
    avatarColor: 'orange',
    status: 'dnd'
  },
  {
    name: 'Marek',
    avatarColor: 'red',
    status: 'offline'
  },
  {
    name: 'Lucia',
    avatarColor: 'blue',
    status: 'online'
  },
  {
    name: 'Andrea',
    avatarColor: 'green',
    status: 'dnd'
  },

]

export default defineComponent({
  name: 'MembersDialog',
  setup() {
    function getMemberStatus(member: Member): string {
      if (member.status === 'online') {
        return 'green';
      } else if (member.status === 'dnd') {
        return 'grey';
      } else {
        return 'red';
      }
    }

    return {
      channelMembersList,
      getMemberStatus
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