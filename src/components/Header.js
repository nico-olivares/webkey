import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './Header.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Navbar from 'react-bootstrap/Navbar'

import Auth from "../pages/Auth"
import Links from '../pages/Links';
import Register from '../pages/Register';
import Login from "../pages/Login";


function Header({user, setUser}) {
    const signOutHandler = (event) => {
        localStorage.setItem('user', '');
        setUser({});
    }
    return (
        <Container id="header" fluid={true}>
            <Row>
                <Col id="logo" md={6} sm={12}>
                    <div>Web Key Logo</div>
                </Col>
                <Col id="info" md={6} sm={12}>
                    <Navbar>
                        { user.token 
                            ? <>
                                <div className="nav-welcome">Welcome, { user.username }</div>
                                <span>|</span>
                                <Link className="nav-link" to="/login" onClick={signOutHandler}>Sign Out</Link>
                              </>
                            : <>
                                <Link className="nav-link" to="/register">Register</Link>
                                <Link className="nav-link" to="/login">Login</Link>
                              </>
                        }
                    </Navbar>
                </Col>
            </Row>
        </Container>
    )
}

export default Header