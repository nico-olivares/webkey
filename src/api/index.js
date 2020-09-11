import axios from 'axios';
let TOKEN_KEY = localStorage.getItem("TOKEN_KEY")
export async function getLinks() {
    try {
        const { data } = await axios.get('/api/links');
        return data;
    } catch (error) {
        throw error;
    }
}
export async function Register({ username, password }) {
    try {
        const response = await axios.get('api/users/register', {
            method: "POST",
            body: JSON.stringify({
                user: {
                    username: username,
                    password: password
                }
            }),
            headers: { "content-type": "application/json; charset=utf-8" }
        })
        const { data } = await response.json()
        console.log('is this working', data)
        const { token } = data
        TOKEN_KEY = token
        if (password === password) {
            localStorage.setItem("TOKEN_KEY", TOKEN_KEY)
        }
        // bootstrap()
        alert("you have no created an account. Please login to access features.")
    }
    catch (error) {
        throw console.error
    }

};

