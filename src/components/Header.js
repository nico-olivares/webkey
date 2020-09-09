import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Header.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'

function Header() {
    return (
        <Container id="header" fluid={true}>
            <Row>
                <Col id="logo" md={6} sm={12}>
                    <div>Web Key Logo</div>  
                </Col>
                <Col id="info" md={6} sm={12}>
                    <div>Login | Register</div>
                </Col>
            </Row>
        </Container>
    )
}

export default Header