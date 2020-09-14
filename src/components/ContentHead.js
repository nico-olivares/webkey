import React from 'react';
import { addNewLink } from '../api/index';

import './ContentHead.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function ContentHead({user, links = [], setLinks}) {

    
    const linkHandler = (event) => {
        console.log('getting to button handler');
        addNewLink({title: 'Link name',  url: 'https://', description: '', tags: []}).then((response) => {
            console.log('the new link is ', response);
        }).catch((error) => {
            throw error;
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
                    <div id="add-new"className="ml-2">
                        <Button className="ml-1" variant="outline-dark"><FontAwesomeIcon icon={ faPlus } onClick={linkHandler} />New</Button>
                    </div>
                    
                </Col>
                <Col md={12} sm={12}>
                    <div className="divider"></div>
                </Col>
            </Row>
        </Container>
    )
}

export default ContentHead;