import React from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Content.css';

import ContentHead from './ContentHead';
import ContentBody from './ContentBody';
import Col from 'react-bootstrap/Col';

function Content({ user, links, setLinks, filteredLinks, setFilteredLinks }) {
    return (
        <Col id="content">
            <ContentHead user={user} links={links} setLinks={setLinks} setFilteredLinks={setFilteredLinks} />
            <ContentBody links={links} filteredLinks={filteredLinks} setFilteredLinks={setFilteredLinks} />
        </Col>
    )
}

export default Content;