<template>

    <div class="aligh-box column items-center justify-center q-pa-md">

        <q-card class="container">

            <q-form class="column q-pt-none" @submit="onSubmit">

                <h4 class="text-center m-pa-xs">Login </h4>

                <q-input color="teal" dense filled v-model="email" label="Enter email *" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Too few characters', val => val && val.length < 320 || 'Too many characters']" />


                <q-input color="teal" dense filled type="password" v-model="password" label="Password *" lazy-rules
                    :rules="[val => val && val.length > 0 || 'No password', val => val && val.length < 64 || 'Too many characters']" />

                <q-btn label="Submit" type="submit" class="bg-dark text-white q-mt-sm" />

                <q-btn flat label="Register" class="q-mt-md" @click="$router.push('/register')" />

            </q-form>

        </q-card>

    </div>

</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { ref } from 'vue'


export default {
    name: 'LoginPage',
    setup() {
        const $q = useQuasar()

        const email = ref(null)
        const password = ref(null)

        return {
            email,
            password,

            onSubmit() {
                $q.notify({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: 'Submitted'
                })
            },


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
</style>