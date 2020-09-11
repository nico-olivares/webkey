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
        const axiosInstance = axios.create({ baseURL: "http://localhost:5000" });
        const response = await axiosInstance.post("/api/users/register", {
            username: username,
            password: password,
        });
        // const { data } = await response.json();   not sure we need this with axios
        console.log("is this working", response);
        //const user = data.user;
        let user = false; // fix to = response.user or something like that

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } else {
            alert("you have not created an account. Please login to access features.");
        }
    } catch (error) {
        throw console.error;
    }
}
