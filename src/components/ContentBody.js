import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './ContentBody.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import LinkContent from './LinkContent';
function ContentBody({ links }) {

    return (
        <Container id="content-body" fluid={true}>
            <Row>
                <Col>
                    <div className="content-links">
                        <Accordion defaultActiveKey="1">
                            {
                                links.map((link) => {
                                    return (
                                        <LinkContent link={link}></LinkContent>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ContentBody;