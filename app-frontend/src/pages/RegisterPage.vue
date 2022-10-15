<template>
    <div>

        <q-form class="fixed-center container" @submit="onSubmit">

            <h4 class="text-center">Registration </h4>

            <q-input filled v-model="name" label="Enter name *" lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled v-model="surname" label="Enter surname *" lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled v-model="nickname" label="Enter nickname *" lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled v-model="email" label="Enter email *" lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled type="any" v-model="password" label="Password *" lazy-rules :rules="[
              val => val && val !== '' || 'Type your password'
            ]" />


            <q-toggle v-model="accept" label="I accept the license and terms" />

            <div lass="fixed-center">
                <q-btn label="Submit" type="submit" color="primary" />

            </div>


        </q-form>

    </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
    name: 'LoginPage',
    setup() {
        const $q = useQuasar()

        const name = ref(null)
        const surname = ref(null)
        const nickname = ref(null)
        const email = ref(null)
        const password = ref(null)
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
                    $q.notify({
                        color: 'green-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: 'Submitted'
                    })
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
    border: 1px solid steelblue;
    padding: 30px;
    border-radius: 5px;
}

.q-input {
    margin: 10px auto;
}
</style>