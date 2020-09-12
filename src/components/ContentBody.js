import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './ContentBody.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ContentBody({ links }) {
    return (
        <Container id="content-body" fluid={true}>
            <Row>
                <Col>
                    <div className="content-links">
                        <p>this is showing</p>
                        {
                            links.map((link, index) => {
                                return <div key={index}>{link.title} {link.url} {link.tags}</div>
                            })
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ContentBody;