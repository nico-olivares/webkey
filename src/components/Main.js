import React from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Main.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Sidebar from './Sidebar';
import Content from './Content';

function Main({ user, links, setLinks, tags, setTags }) {
    // Main is the only component that cares about links
    // Main should fetch links
    return (
            <Container id="container" fluid={true}>
                <Row className="justify-content-center">
                    <Sidebar tags={tags} setTags={setTags} user={user} />
                    <Content user={user} links={links} setLinks={setLinks} />
                </Row>
            </Container>
    )
}

export default Main;