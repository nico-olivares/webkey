import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import './ContentLink.css';

import { updatedLink, updateClicks } from '../api/index';

function ContentLink({ user, key, link }) {
	const [id, setId] = useState(link.id);
	const [url, setUrl] = useState(link.url);
	const [description, setDescription] = useState(link.description);
	const [title, setTitle] = useState(link.title);
	const [tags, setTags] = useState(link.tags);
	const [ clicks, setClicks ] = useState(link.clicks);

	const submitHandler = function (event) {
		event.preventDefault();
		updatedLink({ id, url, title, description, tags }, user.token)
			.then((result) => {})
			.catch((error) => {
				throw error;
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

	const clickHandler = (id, clicks) => {
		updateClicks({id, clicks: clicks + 1}).then(result => {
			setClicks(result.clicks);
		})
	}

	return (
		<Card key={key}>
			<Card.Header>
				<Card.Link className='title' href={link.url} target='_blank' onClick={() => clickHandler(link.id, link.clicks)} >
					{link.title} ({link.clicks})
				</Card.Link>
				<Accordion.Toggle className='btn-toggle' variant='link' eventKey={link.id}>
					<FontAwesomeIcon icon={faChevronDown} />
				</Accordion.Toggle>
			</Card.Header>
			<Accordion.Collapse eventKey={link.id}>
				<Card.Body>
					<Form id='edit-link' onSubmit={submitHandler}>
						<Form.Group className='col-md-12 col-sm-12'>
							<Form.Label htmlFor='link-url'>URL</Form.Label>
							<Form.Control
								value={url}
								id='link-url'
								name='link-url'
								type='text'
								onChange={onChange(setUrl)}
							/>
						</Form.Group>
						<Form.Group className='col-md-12 col-sm-12'>
							<Form.Label htmlFor='link-title'>Title</Form.Label>
							<Form.Control
								value={title}
								id='link-title'
								name='link-title'
								type='text'
								onChange={onChange(setTitle)}
							/>
						</Form.Group>
						<Form.Group className='col-md-12'>
							<Form.Label>Enter Description</Form.Label>
							<Form.Control
								value={description}
								id='link-desc'
								name='link-desc'
								as='textarea'
								rows='4'
								onChange={onChange(setDescription)}
							/>
						</Form.Group>
						<Form.Group className='col-md-12'>
							<Form.Label htmlFor='link-tags'>Tags</Form.Label>
							<Form.Control
								value={tags.length > 0 ? tags.join(' ') : ''}
								id='link-tags'
								name='link-tags'
								type='text'
								onChange={onChange(setTags)}
							/>
						</Form.Group>
						<Button
							className='d-inline-block mt-2 mb-4 mx-3'
							variant='primary'
							type='submit'
						>
							Save Link
						</Button>
					</Form>
				</Card.Body>
			</Accordion.Collapse>
		</Card>
	);
}

export default ContentLink;
