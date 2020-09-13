import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './ContentHead.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function ContentHead() {
    return (
        <Container id="content-head" fluid={true}>
            <Row>
                <Col md={6} sm={12}>
                    <div id="title">
                        <h2>My Links</h2>
                    </div>
                </Col>
                <Col md={6} sm={12}>
                    <div id="search">
                        <Form>
                            <Form.Group id="link-search">
                                <Form.Control type='text' placeholder='Search links...' />
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
                <Col md={12} sm={12}>
                    <div class="divider"></div>
                </Col>
            </Row>
        </Container>
    )
}

export default ContentHead;