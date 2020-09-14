import React from 'react';

import './Sidebar.css';
import { getTags } from '../api/index';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

function Sidebar({ user, tags, setTags }) {
    return (
        <Col id='sidebar' className='col-pixel-width-400'>
            <SideFilter tags={tags} setTags={setTags} />
            <TagList user={user} tags={tags} setTags={setTags} />
        </Col>
    );
}

let firstTime = true;
function SideFilter({ tags = [], setTags }) {

    
    
    let filter;
    let filteredTags;
    let allTags = [];

//As the filter works the tags array gets smaller and smaller and when I undo the typing
//it has no effect because the array doesn't have the prior elements any more.
//Because this file seems to run completely every time I make a change anything I do gets reset.
//Tried storing the array in a separate array, but it gets updated every time as well.
    const filterHandler = (event) => {
        // console.log('all Tags ', allTags);
        console.log('tags ', tags);
        if (firstTime) {
            tags.forEach((tag) => {
                allTags.push(tag);
            })
            
            firstTime = false;
        }
        console.log('all tags ', allTags);
        filter = event.target.value;
        
        filteredTags = allTags.filter((tag) => {

            if (tag.title.startsWith(filter)) {
                return true;
            } else {
                return false;
            }
        })
        
        setTags(filteredTags);
    }
    return (
        <Form className="mt-2 mb-2">
            <Form.Group controlId='formSearchBar'>
                <Form.Control type='text' placeholder='Search tags...' onChange={filterHandler}/>
            </Form.Group>
        </Form>
    );
}

function TagList({ user, tags, setTags }) {

    
    return (
        <>
        <div className="divider"></div>
        <div id="title">
            <h6>Available Tags</h6>
        </div>
        <ListGroupItem>
            {tags.length ? tags.map((tag, i) => {
                return <ListGroup key={i} className='tagButton' variant="primary">{tag.title}</ListGroup>
            }) : ''}
        </ListGroupItem>
        </>
    );
}



export default Sidebar;
