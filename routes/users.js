/** @format */

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersRouter = express.Router();
const { createUser, getUserByUsername, getUser } = require("../db");
const { requireUser } = require('./utils');

usersRouter.post("/register", async (req, res, next) => {
    
    try {
        const { username, password } = req.body;
        const SALT_COUNT = 11;
        let securedPassword;
        const _user = await getUserByUsername({ username });
        if (_user) {
            res.send({
                name: "UserExistsError",
                message: "A user by that username already exists.",
            });
        }
        if (password.length <= 7) {
            res.send({
                name: "PasswordLengthError",
                message: "The password must be a minimum of at least 8 characters.",
            });
        } else {
            securedPassword = await bcrypt.hash(password, SALT_COUNT);

                
                const user = await createUser({ username, password: securedPassword });

                const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
                    expiresIn: "1w",
                });
                delete user.password;
                delete user.id;
                user.token = token;
                
                res.send(user);
            
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

usersRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    // request must have both
    if (!username || !password) {
        res.send({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password",
        });
    }
    try {
        const user = await getUser({ username, password });
        if (!user) {
            console.log('getting to the no user at the route level');
            res.send({
                name: "IncorrectCredentialsError",
                message: "Username or password is incorrect",
            });
        } else {
            const token = jwt.sign(
                {
                    id: user.id,
                    username,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1w",
                }
            );
            
            delete user.password;
            user.token = token;
            res.send({ message: "you're logged in!", user });
        }
        
    } catch (error) {
        console.log(error);
        next(error);
    }
});

usersRouter.get('/', requireUser, async (req, res, next) => {
    
    try {
        res.send({ username: req.user.username, token: req.user.token });
    } catch (error) {
        throw error;
    }
})

module.exports = usersRouter;
