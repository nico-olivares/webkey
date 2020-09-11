import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './ContentHead.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ContentHead() {
    return (
        <Container id="content-head" fluid={true}>
            <Row>
                <Col>
                    <div id="title">
                        <h1>My Links</h1>
                    </div>
                </Col>
                <Col>
                    <div id="search">
                    form goes here
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ContentHead;