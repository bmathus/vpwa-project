<template>
    <div class="q-gutter-md, fixed-center, container" style="max-width: 400px">
        <h3 class="text-center">Registration </h3>
        <q-form @submit="onSubmit" @reset="onReset" class="form_backg">
            <q-input filled v-model="name" label="Enter name *" hint="Name" lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled v-model="surname" label="Enter surname *" hint="Surname" lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled v-model="nickname" label="Enter nickname *" hint="Name which other users will see"
                lazy-rules :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled v-model="email" label="Enter email *" hint="Email" lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled type="any" v-model="password" label="Password *" lazy-rules :rules="[
              val => val && val !== '' || 'Type your password'
            ]" />

            <q-toggle v-model="accept" label="I accept the license and terms" />

            <div>
                <q-btn label="Submit" type="submit" color="primary" />
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
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

            onReset() {
                name.value = null
                age.value = null
                accept.value = false
            }
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
</style>