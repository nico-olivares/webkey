import React, { useState, useEffect } from 'react';
import { addNewLink } from '../api/index';

import './ContentHead.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function ContentHead({user, links = [], setLinks}) {

    const [ newTitle, setNewTitle ] = useState('Link name');
    const [ newUrl, setNewUrl ] = useState('https://');
    const [ newDescription, setNewDescription ] = useState('');
    const [ newTags, setNewTags ] = useState([]);

    const linkHandler = (event) => {
        
        addNewLink({title: 'Link name',  url: 'https://', description: '', tags: []}).then((response) => {
            
        })
        
        
    };

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
                        <Button className="ml-1" variant="outline-dark"><FontAwesomeIcon icon={ faPlus } onClick={linkHandler} />New</Button>
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