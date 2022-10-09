<template>
    <div class="q-gutter-md, fixed-center, container" style="max-width: 400px">
        <h3 class="text-center">Login </h3>
        <q-form @submit="onSubmit" @reset="onReset" class="form_backg">
            <q-input filled v-model="email" label="Enter email *" lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']" />

            <q-input filled type="any" v-model="password" label="Password *" lazy-rules :rules="[
              val => val && val !== '' || 'Type your password'
            ]" />

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

        const email = ref(null)
        const password = ref(null)
        const accept = ref(false)

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
    margin: 30px auto;
    overflow: auto;
    min-height: 300px;
    border: 1px solid steelblue;
    padding: 30px;
    border-radius: 5px;
}
</style>