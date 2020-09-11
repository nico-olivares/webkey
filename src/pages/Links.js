import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, redirect } from 'react-router-dom';

import Main from '../components/Main';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/Button'
import { Card } from 'react-bootstrap';
import Content from '../components/Content';


function Links({ links }) {
    console.log(links)
    return (
        <Main />
    )

}

export default Links