import React from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Content.css';

import ContentHead from './ContentHead';
import ContentBody from './ContentBody';
import Col from 'react-bootstrap/Col';

function Content({ user, links, setLinks }) {
    return (
        <Col id="content">
            <ContentHead user={user} links={links} setLinks={setLinks} />
            <ContentBody links={links} />
        </Col>
    )
}

export default Content;