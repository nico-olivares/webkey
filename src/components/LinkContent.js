import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function LinkContent({ link }) {
    const [url, setUrl] = useState(link.url);
    const [description, setDescription] = useState(link.description);
    const [title, setTitle] = useState(link.title)
    const [tags, setTags] = useState(link.tags);
    const submitHandler = function (event) {
        event.preventDefault();
        console.log(url)
        return [url, tags, description]
    }
    const onChange = (update) => (event) => {
        event.preventDefault();

        update(event.target.value)
    }
    return (
        <Card key={link.id}>
            <Card.Header>
                <div className="title">{link.title}</div>
                <Accordion.Toggle className="btn-toggle" as={Button} variant="link" eventKey={link.id}>
                    <span>Toggle</span>
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={link.id}>
                <Card.Body>

                    <Form id="add-link" onSubmit={submitHandler}>
                        <Form.Group>
                            <Form.Label htmlFor="link-url">URL</Form.Label>
                            <Form.Control value={url} id="link-url" name="link-url" type="text" onChange={onChange(setUrl)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="link-title">Title</Form.Label>
                            <Form.Control value={link.title} id="link-title" name="link-title" type="text" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter Description</Form.Label>
                            <Form.Control
                                value={link.description} id="link-desc" name="link-desc" as="textarea" rows="4"

                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="link-tags">Description</Form.Label>
                            <Form.Control value={link.tags} id="link-tags" name="link-tags" type="text" />
                        </Form.Group>
                        <Button className="d-inline-block" variant="primary" type="submit">Save Link</Button>
                    </Form>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}