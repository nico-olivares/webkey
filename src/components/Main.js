import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Main.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Sidebar from './Sidebar';
import Content from './Content';

function Main({ links, setLinks, tags, setTags, user }) {
    return (
            <Container id="container" fluid={true}>
                <Row className="justify-content-center">
                    <Sidebar tags={tags} setTags={setTags} user={user} />
                    <Content links={links} setLinks={setLinks} />
                </Row>
            </Container>
    )
}

export default Main;