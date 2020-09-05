const express = require('express');
const usersRouter = express.Router();
const { createUser, getUserByUsername } = require('../db');

usersRouter.post('/register', async (req, res, next) => {

    const { username, password } = req.body
    try {
        const user = await createUser({ username, password })
        res.send({
            user
        })
    } catch (error) {
        throw error
    }
})
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }
    try {
        const user = await getUserByUsername({ username })
        if (user.password === password) {
            res.send(
                user
            )
        }
    } catch (error) {
        throw error
    }
})
module.exports = usersRouter
