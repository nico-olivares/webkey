import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Content.css';

import ContentHead from './ContentHead';
import ContentBody from './ContentBody';
import Col from 'react-bootstrap/Col';

function Content({ links }) {

    return (


        <Col id="content">
            <ContentHead />
            <ContentBody>
          <p>this is showing </p>
            {links.map((link, index) => {
                return <div key={index}>{link.title}{link.url} {link.tags} </div>
            })
            }
          </ContentBody>
        </Col>
    )
}

export default Content;