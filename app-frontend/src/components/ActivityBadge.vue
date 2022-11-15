<template>
  <div class="badge" :style="{'background-color':statusColor}"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Status } from '../contracts'

const props = defineProps<{
  status: Status
}>()

const statusColor = computed(() => {
  if (props.status === Status.online) {
    return 'green';
  } else if (props.status === Status.offline) {
    return 'red';
  } else {
    return 'grey';
  }
})

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
