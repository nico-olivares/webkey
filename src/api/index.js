/** @format */

import axios from "axios";
//let TOKEN_KEY = localStorage.getItem("TOKEN_KEY");
export async function getLinks() {
    try {
        const { data } = await axios.get("/api/links");
        return data;
    } catch (error) {
        throw error;
    }
}
export async function register({ username, password }) {
    console.log("getting to the register function");
    try {
        // const axiosInstance = axios.create({ baseURL: "http://localhost:5000" });
        const { data: { user: newUser } } = await axios.post("/api/users/register", {
            username: username,
            password: password,

        });
        // const { data } = await response.json();   not sure we need this with axios
        console.log("is this working", newUser);
        //const user = data.user;
        let user = newUser;

        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        } else {
            alert("you have not created an account. Please login to access features.");
        }
    } catch (error) {
        throw console.error;
    }
}


export async function login({ username, password }) {
    console.log('getting username and password: ', username, password);
    try {
        const { data: { user } } = await axios.post('api/users/login', {
            username,
            password
        });
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
    } catch (error) {
        throw error;
    }
}

export async function createLink({ creatorId, url, title, description, tags = [] }) {
    console.log('getting a newLink', url, title, description, tags = [])
    try {
        const { data: { link } } = await axios.post('api/links', {
            url, title, description, tags =[]
        })
        if (link) {
            console.log('adding a new link', link)
            return link
        }
    } catch (error) {
        throw erroe
    }

}