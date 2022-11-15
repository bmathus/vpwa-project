<template>

  <div class="aligh-box column items-center justify-center q-pa-md">

    <q-card class="container">

      <q-form class="column q-pt-none">

        <h4 class="text-center m-pa-xs">Login </h4>

        <q-input color="teal"
          dense
          filled
          v-model.trim="credentials.email"
          label="Enter email *"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'Too few characters', val => val && val.length < 320 || 'Too many characters']">
        </q-input>

        <q-input
          color="teal"
          dense
          filled
          :type="showPassword ? 'text' : 'password'"
          v-model="credentials.password"
          label="Password *"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'No password', val => val && val.length < 64 || 'Too many characters']">
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPassword = !showPassword" />
          </template>
        </q-input>

        <q-checkbox
          id="rememberMe"
          v-model="credentials.remember"
          label="Remember me"
          color="teal" >
        </q-checkbox>

        <q-btn class="bg-dark text-white row q-mt-md" @click="onSubmit">
          <div class="q-pr-sm">Submit</div>
          <q-spinner v-if="loading" color="white" size="sm" :thickness="6" />
        </q-btn>

        <q-btn flat label="Register" class="q-mt-md" :to="{name:'register'}" />
      </q-form>

    </q-card>

  </div>

</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter, RouteLocationRaw } from 'vue-router'
import { useUserStore } from 'src/stores/userstore'


export default {
  name: 'LoginPage',
  setup() {
    const $q = useQuasar()
    const userstore = useUserStore()
    const $route = useRoute()
    const $router = useRouter()

    const showPassword = ref(false)
    const credentials = reactive({
      email: '',
      password: '',
      remember: false
    })

    const redirectTo = computed((): RouteLocationRaw => {
      return ($route.query.redirect as string) || { name: 'home' };
    })

    const loading = computed((): boolean => {
      return userstore.auth_status === 'pending';
    })

    function onSubmit() {
      userstore.login(credentials)
        .then(() => {
          $router.push({ name: 'home' })
          $q.notify({
            color: 'teal',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Welcome back'
          })
        })
    }

    return {
      credentials,
      loading,
      showPassword,
      onSubmit,
      redirectTo
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  overflow: auto;
  min-height: 300px;

  padding: 20px;
  border-radius: 5px;
}

.aligh-box {
  height: 100vh;
}

.q-input {
  margin-bottom: 10px;
}
</style>
