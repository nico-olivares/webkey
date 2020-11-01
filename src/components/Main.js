import React from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Main.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Sidebar from './Sidebar';
import Content from './Content';

function Main({
	user,
	links,
	setLinks,
	tags,
	setTags,
	filteredTags,
	setFilteredTags,
	filteredLinks,
	setFilteredLinks,
}) {
	return (
		<Container id='container' fluid={true}>
			<Row className='justify-content-center'>
				<Sidebar
					links={links}
					tags={tags}
					setTags={setTags}
					user={user}
					filteredTags={filteredTags}
					setFilteredTags={setFilteredTags}
					setFilteredLinks={setFilteredLinks}
				/>
				<Content
					user={user}
					links={links}
					setLinks={setLinks}
					filteredLinks={filteredLinks}
					setFilteredLinks={setFilteredLinks}
					setTags={setTags}
					setFilteredTags={setFilteredTags}
				/>
			</Row>
		</Container>
	);
}

export default Main;
