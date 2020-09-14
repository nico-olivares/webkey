/** @format */

import React from "react";
// import { BrowserRouter as Router, Route, Link, redirect } from "react-router-dom";

import { register } from "../api/index";

// import Main from "../components/Main";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/Button";

function Register({ user, setUser }) {
    let username;
    let password1;
    let password2;

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password1 === password2) {
            register({ username, password: password1 }).then((newUser) => {
                setUser(newUser);
            });
        }
    };

    const handleUser = (event) => {
        username = event.target.value;
    };
    const handlePassword = (event) => {
        password1 = event.target.value;
    };
    const handlePassword2 = (event) => {
        password2 = event.target.value;
    };

    return (
        <Container id="register">
            <Row>
                <Col>
                    <div>
                        <Form id="register-form" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label htmlFor="username">Username</Form.Label>
                                <Form.Control id="usernameReg" name="username" type="text" onChange={handleUser} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <Form.Control
                                    id="passwordReg"
                                    name="Password"
                                    type="password"
                                    onChange={handlePassword}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="confirm-password">Confirm Password</Form.Label>
                                <Form.Control
                                    id="passwordReg2"
                                    name="Password"
                                    type="password"
                                    onChange={handlePassword2}
                                />
                            </Form.Group>

                            <Button className="d-inline-block" variant="primary" type="submit">Register</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
export default Register;
