import React, { useState } from 'react';

import { addNewLink } from '../api/index';

import './ContentHead.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getLinks } from '../api';

function ContentHead({ user, links = [], setLinks }) {
	const [url, setUrl] = useState('');
	const [description, setDescription] = useState('');
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState([]);

	const submitHandler = function (event) {
		event.preventDefault();
		addNewLink({ url, title, description, tags }).then(() => {
			getLinks().then((allLinks) => {
				
				setLinks(allLinks);
				hideModal();
			});
		});
	};

	const [isOpen, setIsOpen] = useState(false);
	const showModal = () => {
		setIsOpen(true);
	};
	const hideModal = () => {
		setIsOpen(false);
	};

	const handleUrlChange = (event) => {
		setUrl(event.target.value);
	};

	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleTagsChange = (event) => {
		const tagsArray = event.target.value.split(' ');
		setTags(tagsArray);
	};

	return (
		<>
			<Container id='content-head' fluid={true}>
				<Row>
					<Col md={3} sm={12}>
						<div id='title'>
							<h2>My Links</h2>
						</div>
					</Col>
					<Col md={9} sm={12}>
						<div id='add-new' className='ml-2'>
							<Button className='ml-1' variant='outline-dark' onClick={showModal}>
								<FontAwesomeIcon icon={faPlus} />
								New
							</Button>
						</div>
					</Col>
					<Col md={12} sm={12}>
						<div className='divider'></div>
					</Col>
				</Row>
			</Container>
			<Modal size='lg' size='lg' centered show={isOpen} onHide={hideModal}>
				<Modal.Header>
					<Modal.Title>Add A Link</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id='edit-link' onSubmit={submitHandler}>
						<Form.Group className='col-md-12 col-sm-12'>
							<Form.Label htmlFor='link-url'>URL</Form.Label>
							<Form.Control
								placeholder='https://'
								id='link-url'
								name='link-url'
								type='text'
								onChange={handleUrlChange}
							/>
						</Form.Group>
						<Form.Group className='col-md-12 col-sm-12'>
							<Form.Label htmlFor='link-title'>Title</Form.Label>
							<Form.Control
								placeholder='Enter a name'
								id='link-title'
								name='link-title'
								type='text'
								onChange={handleTitleChange}
							/>
						</Form.Group>
						<Form.Group className='col-md-12'>
							<Form.Label>Enter Description</Form.Label>
							<Form.Control
								placeholder='Enter a description'
								id='link-desc'
								name='link-desc'
								as='textarea'
								rows='4'
								onChange={handleDescriptionChange}
							/>
						</Form.Group>
						<Form.Group className='col-md-12'>
							<Form.Label htmlFor='link-tags'>Tags</Form.Label>
							<Form.Control
								placeholder=''
								id='link-tags'
								name='link-tags'
								type='text'
								onChange={handleTagsChange}
							/>
						</Form.Group>
						
							<Button
								className='d-inline-block mt-2 mb-4 mx-3'
								variant='primary'
								type='submit'
							>
								Create Link
							</Button>
							<Button onClick={hideModal} className='d-inline-block mt-2 mb-4 mx-3' >Cancel</Button>
						
					</Form>
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
		</>
	);
}

export default ContentHead;
