import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './ContentBody.css';

import { Container, Row, Col } from 'react-bootstrap';

import Accordion from 'react-bootstrap/Accordion';
import ContentLink from './ContentLink';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

function ContentBody({ user, links, setTags, setFilteredTags, filteredLinks, setFilteredLinks }) {
	const [linkSearchString, setLinkSearchString] = useState('');

	const searchHandler = (event) => {
		// event.preventDefault();
		setLinkSearchString(event.target.value);

		const filteredLinksArray = links.filter((link) => {
			if ((link.title).toLowerCase().startsWith(event.target.value.toLowerCase())) {
				return true;
			} else {
				return false;
			}
		});

		setFilteredLinks(filteredLinksArray);
    };
    
    const resetHandler = () => {
		
		setLinkSearchString('');
		setFilteredLinks(links);
	};

	// const [ link, setLink ] = useState({});
	return (
		<Container id='content-body' fluid={true}>
			<Row>
				<Col>
					<div id='search'>
						<InputGroup id='link-search'>
							<FormControl
								type='text'
								value={linkSearchString}
								placeholder='Search links...'
								onChange={searchHandler}
							/>
							<InputGroup.Append>
								
									<InputGroup.Text as={Button} onClick={resetHandler}>x</InputGroup.Text>
								
							</InputGroup.Append>
						</InputGroup>
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className='content-links'>
						<Accordion defaultActiveKey='1'>
							{filteredLinks.length
								? filteredLinks.map((link) => {
									return <ContentLink user={user} key={link.id} link={link} setTags={setTags} setFilteredTags={setFilteredTags} />;
								  })
								: ''}
						</Accordion>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default ContentBody;
