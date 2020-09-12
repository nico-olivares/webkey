import React from 'react';
import { BrowserRouter as Router, Route, Link, redirect } from 'react-router-dom';

import Main from '../components/Main';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/Button'

import { login } from '../api/index'


function Login({ user, setUser }) {
    let username;
    let password;

    const submitHandler = (event) => {
        event.preventDefault();
        console.log("this is the username...", username);
        console.log("this is the password1...", password);
        login({username, password}).then((user) => {
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        })
    }

    const usernameHandler = (event) => {
        username = event.target.value;
    }

    const passwordHandler = (event) => {
        password = event.target.value;
    }

    
    return (
        <Container>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control id="username" name="username" type="text" onChange={usernameHandler} />
                </Form.Group>


                <Form.Group>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control id="password" name="Password" type="password" onChange={passwordHandler} />
                </Form.Group>

                <Button className="d-inline-block" variant="primary" type="submit"  >
                    Login
            </Button>
            </Form>
        </Container>
    )
}
export default Login