import React, { useEffect } from 'react';

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


function SideFilter({ tags, setTags }) {

    let filter;
    let filteredTags;
    const filterHandler = (event) => {
        filter = event.target.value;
        
        filteredTags = tags.filter((tag) => {

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

function TagList({ user = {}, tags = [], setTags }) {

    useEffect(() => {
        if (user.id) {
            getTags(user.id).then((tagArray) => {
                setTags(tagArray);
            }).catch((error) => {
                throw error;
            })
        }
    }, [user]);


    return (
        <>
        <div class="divider"></div>
        <div id="title">
            <h6>Available Tags</h6>
        </div>
        <ListGroupItem>
            {tags.map((tag, i) => {
                return <ListGroup key={'"' + 'tag' + i + '"'} className='tagButton' variant="primary">{tag.title}</ListGroup>
            })}
        </ListGroupItem>
        </>
    );
}



export default Sidebar;
