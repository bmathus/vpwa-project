<template>
    <div class="align-box column items-center justify-center q-pa-md">
        <q-card class="container">
            <q-form @submit="onSubmit">


                <h4 class="text-center">Registration </h4>

                <q-input dense filled v-model="name" label="Enter name *" lazy-rules :rules="[val => val && val.length != '' || 'Please type something',
                val => val && val.length <= 20 || 'Too many characters',
                val => val && validate_input(val) || 'No special characters']" />

                <q-input dense color="teal" filled v-model="surname" label="Enter surname *" lazy-rules :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length <= 20 || 'Too many characters',
                val => val && validate_input(val) || 'No special characters']" />

                <q-input dense color="teal" filled v-model="nickname" label="Enter nickname *" lazy-rules
                    :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length <= 20 || 'Too many characters', val => val && !val.includes('/') || 'No special characters']" />

                <q-input dense color="teal" filled type="email" v-model="email" label="Enter email *" lazy-rules
                    :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length <= 320 || 'Too many characters']" />

                <q-input dense color="teal" filled type="password" v-model="password" label="Password *" lazy-rules
                    :rules="[val => val && val.length != '' || 'Please type something', val => val && val.length < 64 || 'Too many characters']" />


                <q-toggle color="teal" v-model="accept" label="I accept the license and terms" />


                <q-btn label="Submit" type="submit" class="bg-dark text-white q-mt-sm" />



            </q-form>
        </q-card>

    </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useUserStore } from '../stores/userstore';
import { useRouter } from 'vue-router'

export default {
    name: 'LoginPage',
    setup() {
        const $q = useQuasar()
        const router = useRouter()

        const name = ref('')
        const surname = ref('')
        const nickname = ref('')
        const email = ref('')
        const password = ref('')
        const accept = ref(false)

        return {
            name,
            surname,
            nickname,
            email,
            password,
            accept,

            onSubmit() {

                if (accept.value !== true) {

                    $q.notify({
                        color: 'red-5',
                        textColor: 'white',
                        icon: 'warning',
                        message: 'You need to accept the license and terms first'
                    })
                }
                else {


                    useUserStore().makeRegistration(0, name.value, surname.value, nickname.value, email.value, password.value)
                    router.push('/')
                }
            }
        }
    }, methods: {
        validate_input(name: string): boolean {
            for (let i = 0; i < name.length; i++) {
                if ((name[i] >= 'A' && name[i] <= 'Z') || (name[i] >= 'a' && name[i] <= 'z')) {
                    continue

                }
                else {
                    return false
                }

            }
            return true
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 400px;
    width: 100%;
    overflow: auto;
    min-height: 300px;
    padding: 30px;
    border-radius: 5px;
}

.align-box {
    height: 100vh;
}

.q-input {
    margin: 6px auto;
}
</style>