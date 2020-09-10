import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, useRouteMatch } from 'react-router-dom';

import './Header.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Navbar from 'react-bootstrap/Navbar'

import Links from '../pages/Links';
import Register from '../pages/Register';
import Login from "../pages/Login";
import Auth from "../pages/Auth"

function Header() {
    let { path, url } = useRouteMatch();
    return (

        <Container id="header" fluid={true}>
            <Row>
                <Col id="logo" md={6} sm={12}>
                    <div>Web Key Logo</div>
                </Col>

                <Col id="info" md={6} sm={12}>
                    <div>
                        <Navbar>

                            <Link to="/home">Home</Link>
                            {/* <Route path='/' exact render={() => <Links />} /> */}

                            <Link to="/register">Register</Link>
                            {/* <Route path='/register' exact render={() => <Register />} /> */}

                            <Link to="/login">Login</Link>
                            {/* <Route path='/login' exact render={() => <Login />} /> */}
                        </Navbar>
                    </div>
                </Col>

            </Row>
        </Container>
    )
}

export default Header