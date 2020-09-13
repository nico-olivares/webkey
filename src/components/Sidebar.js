import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Sidebar.css';
import { getTags } from '../api/index';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

function Sidebar({ user, tags, setTags }) {
    return (
        <Col id='sidebar' className='col-pixel-width-400'>
            <SideFilter />
            <TagList user={user} tags={tags} setTags={setTags} />
        </Col>
    );
}

function SideFilter({ setTagList }) {
    return (
        <Form>
            <Form.Group controlId='formSearchBar'>
                <Form.Control type='text' placeholder='Search tags...' />
            </Form.Group>
        </Form>
    );
}

function TagList({ user = {}, tags = [], setTags }) {
    
    

    useEffect(() => {
        if (user.id) {
            getTags(user.id).then((tagArray) => {
                setTags(tagArray);
            }).catch((error) => {
                throw error;
            })
        }
    }, [user]);



    return (
        <>
        <ListGroupItem>
            {tags.map((tag, i) => {
                return <ListGroup key={'"' + 'tag' + i + '"'} className='tagButton' variant="primary">{tag.title}</ListGroup>
            })}
            </ListGroupItem>
        </>
    );
}



export default Sidebar;
