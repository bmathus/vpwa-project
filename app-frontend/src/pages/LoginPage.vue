<template>

    <div class="row">

        <q-card class="fixed-center container">

            <q-form class="column q-pa-md" @submit="onSubmit">

                <h4 class="text-center">Login </h4>

                <q-input filled v-model="email" label="Enter email *" lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']" />


                <q-input filled type="any" v-model="password" label="Password *" lazy-rules
                    :rules="[val => val && val !== '' || 'Type your password']" />

                <q-btn label="Submit" type="submit" color="primary" />

                <router-link class=" q-pa-md text-center" to='/register'> Forgot password? </router-link>



            </q-form>

        </q-card>

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
    max-width: 400px;
    margin: 20px auto;
    overflow: auto;
    min-height: 300px;
    border: 1px solid steelblue;
    padding: 20px;
    border-radius: 5px;

}

.bg-image {
    background-image: url(https://img.freepik.com/free-vector/white-gold-geometric-pattern-background-vector_53876-140726.jpg?w=2000&t=st=1665859939~exp=1665860539~hmac=1964884ac792b7ddad1f0345d8ed5fa6d8f58be8905230f6fcd65c45353c81d3);
    background-repeat: no-repeat;
    background-size: cover;
}

.button_botton {
    margin-bottom: 10px;
}
</style>