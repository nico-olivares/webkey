import React, { useState, useEffect } from 'react';

import './ContentHead.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function ContentHead() {
    return (
        <Container id="content-head" fluid={true}>
            <Row>
                <Col md={3} sm={12}>
                    <div id="title">
                        <h2>My Links</h2>
                    </div>
                </Col>
                <Col md={9} sm={12}>
                    <div id="add-new"class="ml-2">
                        <Button className="ml-1" variant="outline-dark"><FontAwesomeIcon icon={ faPlus } />New</Button>
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