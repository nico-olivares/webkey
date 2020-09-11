import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Main.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Sidebar from './Sidebar';
import Content from './Content';

function Main({ links }) {
    return (
        <Container id="main" fluid={true}>

            <Row className="justify-content-center ">
                <Sidebar />
                <Content links={links}>


                </Content>

            </Row>
        </Container>
    )
}

export default Main;