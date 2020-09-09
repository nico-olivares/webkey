import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Content.css';

import Col from 'react-bootstrap/Col';

function Content() {
    return (
        <Col>
            <div>This is the content component</div>
        </Col>
    )
}

export default Content;