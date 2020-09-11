import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Content.css';
import Main from './Main'
import Col from 'react-bootstrap/Col';

function Content({ links }) {

    return (
        <Col>
            <p>this is showing </p>
            {links.map((link, index) => {
                return <div key={index}>{link.title}{link.url} {link.tags} </div>
            })
            }
        </Col>
    )
}

export default Content;