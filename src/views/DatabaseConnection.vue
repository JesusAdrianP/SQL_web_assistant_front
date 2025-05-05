<template>
    <div class="database-connection">
        <h1>Database Connection</h1>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="db_name">Database Name:</label>
                <input type="text" id="db_name" v-model="form.db_name" required />
            </div>
            <div class="form-group">
                <label for="db_user">Database User:</label>
                <input type="text" id="db_user" v-model="form.db_user" required />
            </div>
            <div class="form-group">
                <label for="db_password">Database Password:</label>
                <input type="password" id="db_password" v-model="form.db_password" required />
            </div>
            <div class="form-group">
                <label for="db_host">Database Host:</label>
                <input type="text" id="db_host" v-model="form.db_host" required />
            </div>
            <button type="submit">Connect</button>
        </form>
    </div>
</template>

<script>
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "DatabaseConnection",
    data() {
        return {
            form: {
                db_name: '',
                db_user: '',
                db_password: '',
                db_host: ''
            }
        };
    },
    methods: {
        submitForm() {
            console.log('Form submitted:', this.form);
            // Add your logic to handle the form submission
        }
    }
};
</script>

<style scoped>
.database-connection {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>