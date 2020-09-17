import React, { useState, useEffect } from 'react';

import './Sidebar.css';
import { getTags } from '../api/index';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

function Sidebar({ user, tags, setTags, filteredTags, setFilteredTags }) {
    // const [ filteredTags, setFilteredTags ] = useState([]);

        
    return (
        <Col id='sidebar' className='col-pixel-width-400'>
            <SideFilter tags={tags} setTags={setTags} filteredTags={filteredTags} setFilteredTags={setFilteredTags} />
            <TagList user={user} tags={tags} setTags={setTags} filteredTags={filteredTags} />
        </Col>
    );
}


function SideFilter({ tags, setTags, filteredTags, setFilteredTags }) {
    

//As the filter works the tags array gets smaller and smaller and when I undo the typing
//it has no effect because the array doesn't have the prior elements any more.
//Because this file seems to run completely every time I make a change anything I do gets reset.
//Tried storing the array in a separate array, but it gets updated every time as well.


    const filterHandler = (event) => {
       
        const filter = event.target.value;
        
        const filteredTagsArray = tags.filter((tag) => {

            if (tag.title.startsWith(filter)) {
                return true;
            } else {
                return false;
            }
        })

        setFilteredTags(filteredTagsArray);
    }
    return (
        <Form className="mt-2 mb-2">
            <Form.Group controlId='formSearchBar'>
                <Form.Control type='text' placeholder='Search tags...' onChange={filterHandler}/>
            </Form.Group>
        </Form>
    );
}

function TagList({ user, tags, setTags, filteredTags}) {

    
    return (
        <>
        <div className="divider"></div>
        <div id="title">
            <h6>Available Tags</h6>
        </div>
        <ListGroupItem>
            {filteredTags.length ? filteredTags.map((tag, i) => {
                return <ListGroup key={i} className='tagButton' variant="primary">{tag.title}</ListGroup>
            }) : ''}
        </ListGroupItem>
        </>
    );
}



export default Sidebar;
