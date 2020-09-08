import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import './Header.css'

function Header() {
    return (
        <Container fluid={true}>
            <Row className="header-row justify-content-center ">
                <Col className="space-evenly" md={6} sm={12}>
                    <p>This is working</p>
                </Col>
                <Col className="text-align-right" md={6} sm={12}>This is working
                </Col>

            </Row>



        </Container>
    )
}

export default Header