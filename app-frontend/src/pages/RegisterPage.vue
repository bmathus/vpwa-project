<template>
    <div class="align-box column items-center justify-center q-pa-md">
        <q-card class="container">
            <q-form class="column">
                <h4 class="text-center">Registration </h4>

                <q-input dense
                  color="teal"
                  filled
                  v-model="form.name"
                  label="Enter name *"
                  lazy-rules
                  :rules="[val => val && val.length != '' || 'Please type something',val => val && val.length <= 20 || 'Too many characters',val => val && validate_input(val) || 'No special characters or spaces']"
                />

                <q-input dense
                  color="teal"
                  filled
                  v-model="form.surname"
                  label="Enter surname *"
                  lazy-rules
                  :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length <= 20 || 'Too many characters',val => val && validate_input(val) || 'No special characters or spaces']"
                />

                <q-input dense
                  color="teal"
                  filled
                  v-model="form.nickname"
                  label="Enter nickname *"
                  lazy-rules
                  :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length <= 20 || 'Too many characters', val => val && validate_input(val) || 'No special characters or spaces']"
                />

                <q-input dense
                  color="teal"
                  filled
                  type="email"
                  v-model.trim="form.email"
                  label="Enter email *"
                  lazy-rules
                  :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length <= 320 || 'Too many characters']"
                />

                <q-input dense
                  name="password"
                  color="teal"
                  filled
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  label="Password *"
                  lazy-rules
                  :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length < 64 || 'Too many characters', val => val && val.length >= 8|| 'Password mus have at least 8 chars']"
                  bottom-slots
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword" />
                  </template>
                </q-input>

                <q-input dense
                  color="teal"
                  filled
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.passwordConfirmation"
                  label="Confirm password*"
                  lazy-rules
                  :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length < 64 || 'Too many characters',val => val && val === form.password || 'Passwords doesnt match']"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword" />
                  </template>
                </q-input>

                <q-toggle color="teal"
                  v-model="accept"
                  label="I accept the license and terms"
                />

                <q-btn class="bg-dark text-white row q-mt-sm" @click="onSubmit">
                    <div class="q-pr-sm">Submit</div>
                    <q-spinner v-if="loading" color="white" size="sm" :thickness="6" />
                </q-btn>

            </q-form>
        </q-card>
    </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { ref,reactive, computed } from 'vue'
import { useUserStore } from 'src/stores/userstore'
import { useRouter,RouteLocationRaw } from 'vue-router'
import { User } from 'src/contracts'

export default {
    name: 'LoginPage',
    setup() {
        const $q = useQuasar()
        const $router = useRouter()
        const userstore = useUserStore()

        const accept = ref(false)
        const showPassword = ref(false);
        const form = reactive({
          email:'',
          password:'',
          passwordConfirmation: '',
          name:'',
          surname:'',
          nickname:'',
          avatar_color:'blue'
        })

        const loading = computed(():boolean => {
          return userstore.auth_status === 'pending';
        });

        const redirectTo = computed((): RouteLocationRaw => {
          return { name: 'login' }
        })

        async function onSubmit() {
            if (accept.value !== true) {
                $q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message: 'You need to accept the license and terms first'
                })
                return
            }

            const responce: string | User = await userstore.register(form)

            if( typeof responce === 'string' && responce == 'err'){
              $q.notify({
                type: 'info',
                message: 'Email or nickname is already taken.',
                color: 'red-5',
              });

            } else {
              $router.push(redirectTo.value)
            }

        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function isNumber(n: any) {
          return !isNaN(parseFloat(n)) && !isNaN(n - 0) ;
        }

        function validate_input(inputText: string): boolean {

            for (let i = 0; i < inputText.length; i++) {
                if ((inputText[i] >= 'A' && inputText[i] <= 'Z') || (inputText[i] >= 'a' && inputText[i] <= 'z') || isNumber(inputText[i])) {
                    continue
                }
                else {
                    return false
                }
            }
            return true
        }

        return {
            form,
            accept,
            loading,
            showPassword,
            validate_input,
            onSubmit
        }
    },
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

.align-box {
    height: 100vh;
}

.q-input {
    margin-bottom: 10px;
}
</style>
