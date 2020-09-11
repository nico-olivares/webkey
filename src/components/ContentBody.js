import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './ContentBody.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ContentBody() {
    return (
        <Container id="content-body" fluid={true}>
            <Row>
                <Col>
                    <div class="content-links">
                        some content here / list of links accordion
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ContentBody;