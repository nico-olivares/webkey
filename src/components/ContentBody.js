import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './ContentBody.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ContentBody({ links }) {
    return (
        <Container id="content-body" fluid={true}>
            <Row>
                <Col>
                    <div className="content-links">
                        <Accordion defaultActiveKey="1">
                            {
                                links.map((link, index) => {
                                    return (
                                        <Card key={index}>
                                            <Card.Header>
                                                <div className="title">{link.title}</div>
                                                <Accordion.Toggle className="btn-toggle" as={Button} variant="link" eventKey={link.id}>
                                                    <span>Toggle</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={link.id}>
                                                <Card.Body>

                                                    <Form id="add-link" onSubmit="{ }">
                                                        <Form.Group>
                                                            <Form.Label htmlFor="link-url">URL</Form.Label>
                                                            <Form.Control value={link.url} id="link-url" name="link-url" type="text" onChange="{}" />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label htmlFor="link-title">Title</Form.Label>
                                                            <Form.Control value={link.title} id="link-title" name="link-title" type="text" onChange="{}" />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>Enter Description</Form.Label>
                                                            <Form.Control 
                                                                value={link.description} id="link-desc" name="link-desc" as="textarea" rows="4"
                                                                onChange="{}"
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label htmlFor="link-tags">Description</Form.Label>
                                                            <Form.Control value={link.tags} id="link-tags" name="link-tags" type="text" onChange="{}" />
                                                        </Form.Group>
                                                        <Button className="d-inline-block" variant="primary" type="submit">Save Link</Button>
                                                    </Form>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
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