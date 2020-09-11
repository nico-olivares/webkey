/** @format */

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, redirect } from "react-router-dom";

import Main from "../components/Main";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/Button";

function Register({ newUser, setNewUser }) {
    console.log("newUSer", newUser);
    let TOKEN_KEY = localStorage.getItem("TOKEN_KEY");
    let user;
    let password1;
    let password2;

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("this is the register event", event);
        console.log("this is the user...", user);
        console.log("this is the password1...", password1);
        console.log("this is the password2...", password2);

        //check the password if they match create user
        // axios call gets the token
        // once theres a user
        // check for token
        //successful register
        // {...user}
        setNewUser(user);
    };

    const handleUser = (event) => {
        user = event.target.value;
        return user;
        // storeCurrentUser(selectedUser); // NEW
        // setNewUser(selectedUser);
    };
    const handlePassword = (event) => {
        password1 = event.target.value;
        return password1;
        // storeCurrentUser(selectedUser); // NEW
        // setNewUser(selectedUser);
    };
    const handlePassword2 = (event) => {
        password2 = event.target.value;
        return password2;
        // storeCurrentUser(selectedUser); // NEW
        // setNewUser(selectedUser);
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control
                        id="username"
                        name="username"
                        type="text"
                        onChange={handleUser}
                        value={newUser.username}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control
                        id="password"
                        name="Password"
                        type="text"
                        onChange={handlePassword}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="confirm-password">Confirm Password</Form.Label>
                    <Form.Control
                        id="password"
                        name="Password"
                        type="text"
                        onChange={handlePassword2}
                    />
                </Form.Group>

                <Button className="d-inline-block" variant="primary" type="submit">
                    Send
                </Button>
            </Form>
        </div>
    );
}
export default Register;
