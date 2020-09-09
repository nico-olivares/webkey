import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Sidebar.css';

import Col from 'react-bootstrap/Col';

function Sidebar() {
    return(
        <Col id="sidebar" className="col-pixel-width-400">
            <div>This is the sidebar component</div>
        </Col>
    )
}
export default Sidebar;