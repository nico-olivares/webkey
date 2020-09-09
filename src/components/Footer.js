import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Footer.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'


function Footer() {
    return (
        <Container id="footer" fluid={true}>
            <Row>
                <Col className="col">
                    <div>Web Key &copy; 2000 - Olivares Causey Marcello</div>
                </Col>
            </Row>


        </Container>


    )

}
export default Footer