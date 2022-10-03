<template>
  <div class="badge" :style="{'background-color':statusColor}"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'ActivityBadge',
  props: {
    status: String
  },
  setup(props) {

    const statusColor = computed(() => {
      if (props.status === 'online') {
        return 'green';
      } else if (props.status === 'offline') {
        return 'red';
      } else {
        return 'grey';
      }
    })

    return {
      statusColor
    }
  }
});
</script>

<style scoped>
.badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  border-style: solid;
  border-color: rgb(29, 29, 29);
  border-width: 2px;
  border-radius: 8px;
  height: 14px;
  width: 14px;
}
</style>