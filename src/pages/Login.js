import React from 'react';
import { BrowserRouter as Router, Route, Link, redirect } from 'react-router-dom';

import Main from '../components/Main';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/Button'






function Login() {

    return (
        <Container>
            <Form>
                <Form.Group>
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control id="username" name="username" type="text" value="" />
                </Form.Group>


                <Form.Group>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control id="password" name="Password" type="text" value="" />
                </Form.Group>

                <Button className="d-inline-block" variant="primary" type="submit" >
                    Login
            </Button>
            </Form>
        </Container>
    )
}
export default Login