import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Sidebar.css';

import Col from 'react-bootstrap/Col';
import Button  from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Sidebar({ tagList, setTagList }) {
	return (
		<Col id='sidebar' className='col-pixel-width-400'>
			<SideFilter />
            <TagList />
		</Col>
	);
}

function SideFilter({ setTagList }) {
	return (
		<Form>
			<Form.Group controlId='formSearchBar'>
				<Form.Control type='text' placeholder='Search tags...' />
			</Form.Group>
		</Form>
	);
}

function TagList({ tagList, setTagList }) {
    
    
    fetch('http://localhost:5000/api/tags/usertags').then((result) => {
        return result.json();
    }).then(newResult => {
        tagList = newResult;
    })

    console.log('tagListFunc ', tagList);

	return (
		<>
            {tagList.map((tag, i) => {
                return <Button id={'"' + 'tag' + i + '"'} className='tagButton' variant="primary">{tag}</Button>
            })}
        </>
	);
}

async function fetch(url) {
    try {
        return await fetch(url);
    } catch (error) {
        throw error;
    }
}

export default Sidebar;
