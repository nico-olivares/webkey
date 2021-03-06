import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import './ContentLink.css';

import { updatedLink, updateClicks, getTags } from '../api/index';
import { useAccordionToggle } from 'react-bootstrap';

function ContentLink({ user, link, setTags: setGlobalTags, setFilteredTags }) {
	const id = link.id;
	const [url, setUrl] = useState(link.url);
	const [description, setDescription] = useState(link.description);
	const [title, setTitle] = useState(link.title);
	const [tags, setTags] = useState(link.tags);
	const [clicks, setClicks] = useState(link.clicks);
	const [ thisLink, setThisLink ] = useState(link);

	const submitHandler = function (event) {
		event.preventDefault();
		updatedLink({ id, url, title, description, tags }, user.token)
			.then((result) => {
				
				setThisLink(result);
				setUrl(result.url);
				setDescription(result.description);
				setTitle(result.title);
				setTags(result.tags);
			
			}).then(() => {
				getTags()
			.then((result) => {
				setGlobalTags(result);
				setFilteredTags(result);
			})
			})
			.catch((error) => {
				console.error(error);
			});
			
	};

	const onChange = (update) => (event) => {
		event.preventDefault();
		if (update === setTags) {
			const tagsArray = event.target.value.split(' ');
			update(tagsArray);
		} else {
		update(event.target.value);
		}
	};

	const clickHandler = (id) => {
		updateClicks(id, user.token).then(result => {
			setClicks(result.clicks);
		})
	}

	return (
		<Card >
			<Card.Header>
				<Card.Link className='title' href={link.url} target='_blank' onClick={() => clickHandler(thisLink.id)} >
					{thisLink.title} ({clicks})
				</Card.Link>
				<Accordion.Toggle className='btn-toggle' variant='link' eventKey={thisLink.id}>
					<FontAwesomeIcon icon={faChevronDown} />
				</Accordion.Toggle>
			</Card.Header>
			<Accordion.Collapse eventKey={thisLink.id}>
				<Card.Body>
					<Form className='edit-link' onSubmit={submitHandler}>
						<Form.Group className='col-md-12 col-sm-12'>
							<Form.Label htmlFor='link-url'>URL</Form.Label>
							<Form.Control
								value={url}
								className='link-url'
								
								type='text'
								onChange={onChange(setUrl)}
							/>
						</Form.Group>
						<Form.Group className='col-md-12 col-sm-12'>
							<Form.Label htmlFor='link-title'>Title</Form.Label>
							<Form.Control
								value={title}
								className='link-title'
								
								type='text'
								onChange={onChange(setTitle)}
							/>
						</Form.Group>
						<Form.Group className='col-md-12 link-desc-group' >
							<Form.Label>Description</Form.Label>
							<Form.Control
								value={description}
								className='link-desc'
								as='textarea'
								rows='4'
								onChange={onChange(setDescription)}
							/>
						</Form.Group>
						<Form.Group className='col-md-12'>
							<Form.Label htmlFor='link-tags'>Tags</Form.Label>
							<Form.Control
								value={tags.length > 0 ? tags.join(' ') : ''}
								className='link-tags'
								
								type='text'
								onChange={onChange(setTags)}
							/>
						</Form.Group>
						<Form.Group className='update-link-btn'>
							
								<Button
									className='d-inline-block mt-2 mb-4 mx-3'
									
									variant='primary'
								type='submit'
								onClick={useAccordionToggle(thisLink.id, () => { })}
								>
									Save Link
								</Button>
							
						</Form.Group>
					</Form>
				</Card.Body>
			</Accordion.Collapse>
		</Card>
	);
}

export default ContentLink;
