<template>
    <div>

        <q-form class="fixed-center container" @submit="onSubmit">

            <h4 class="text-center">Registration </h4>

            <q-input filled v-model="name" label="Enter name *" lazy-rules
                :rules="[ val => val && val.length != '' || 'Please type something', val => val && val.length <= 20 || 'Too many characters', val => val && !val.includes('/') || 'No special characters']" />

            <q-input filled v-model="surname" label="Enter surname *" lazy-rules
                :rules="[ val => val && val.length != '' || 'Please type something', val => val && val.length <= 20 || 'Too many characters', val => val && !val.includes('/') || 'No special characters']" />

            <q-input filled v-model="nickname" label="Enter nickname *" lazy-rules
                :rules="[ val => val && val.length != '' || 'Please type something', val => val && val.length <= 20 || 'Too many characters', val => val && !val.includes('/') || 'No special characters']" />

            <q-input filled type="email" v-model="email" label="Enter email *" lazy-rules
                :rules="[ val => val && val.length != '' || 'Please type something', val => val && val.length <= 320 || 'Too many characters']" />

            <q-input filled type="password" v-model="password" label="Password *" lazy-rules
                :rules="[ val => val && val.length != '' || 'Please type something', val => val && val.length < 256 || 'Too many characters']" />


            <q-toggle v-model="accept" label="I accept the license and terms" />

            <div lass="fixed-center">
                <q-btn label="Submit" type="submit" class="bg-dark text-white" />

            </div>


        </q-form>

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
            },
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 500px;
    margin: 50px auto;
    overflow: auto;
    min-height: 300px;
    border: 1px solid rgb(6, 9, 12);
    padding: 30px;
    border-radius: 5px;
}

.q-input {
    margin: 10px auto;
}
</style>