import React from 'react';
import { BrowserRouter as Router, Route, Link, redirect } from 'react-router-dom';
import { useState, useEffect } from 'react'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/Button'

import Register from './Register';
import Login from './Login';

function Auth(props) {
    const [message, setMessage] = useState();
    console.log('this is the props...', props)
    return (
        <Router>
            <>
                <Link className="nav-link" to="/auth/register">Create Account</Link>
                <Route path='/auth' exact render={() => <Register />} />

                <Link className="nav-link" to="/auth/login">Login</Link>
                <Route path='/login' exact render={() => <Login />} />
            </>
        </Router>
    )
}
export default Auth