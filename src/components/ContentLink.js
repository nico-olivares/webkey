import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { updatedLink } from '../api/index'

function ContentLink({ link }) {

    const [url, setUrl] = useState(link.url);
    const [description, setDescription] = useState(link.description);
    const [title, setTitle] = useState(link.title)
    const [tags, setTags] = useState(link.tags);

    const submitHandler = function (event) {
        event.preventDefault();

        // brett let's discuss getting the updatedLink function into here
        // i'd like to do this ^ instead of calling it with onClick below
        // i can get the url, title and description to update but not tags
        // also not I can only get one link to update so I hard coded the link id in the axios call

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
                            <Form.Control value={title} id="link-title" name="link-title" type="text" onChange={onChange(setTitle)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter Description</Form.Label>
                            <Form.Control value={description} id="link-desc" name="link-desc" as="textarea" rows="4" onChange={onChange(setDescription)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="link-tags">Tags</Form.Label>
                            <Form.Control value={tags} id="link-tags" name="link-tags" type="text" onChange={onChange(setTags)} />
                        </Form.Group>
                        <Button 
                            className="d-inline-block" variant="primary" type="submit"
                            onClick={ () => { updatedLink({ url, title, description, tags }); }}
                        >Save Link</Button>
                    </Form>

                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

export default ContentLink;