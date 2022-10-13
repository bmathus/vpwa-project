
<template>
  <q-page>
    <div class="q-pa-md">
      <q-infinite-scroll @load="onLoad" reverse :offset="50">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <div v-for="(item, index) in items" :key="index" class="caption q-py-sm">
          <q-badge class="shadow-1">
            {{ items.length - index }}
          </q-badge>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas
          eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </div>
        <div ref="scrollto" />

      </q-infinite-scroll>

    </div>
  </q-page>

</template>


  
<script>
import { ref } from 'vue'
import { useChannelStore } from '../stores/channelstore';

export default {

  setup() {
    const items = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}])
    const store = useChannelStore()
    const scrollto = ref();
    let firstScroll = true;

    return {
      store,
      items,
      scrollto,
      onLoad(index, done) {
        if (firstScroll) {
          done()
          console.log('done')
          scrollto.value.scrollIntoView();
          firstScroll = false;
        } else {
          setTimeout(() => {
            items.value.splice(0, 0, {}, {}, {}, {}, {}, {}, {})
            done()
          }, 2000)

        }


      }
    }
  }
}
</script>
