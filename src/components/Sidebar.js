import React, { useState, useEffect } from 'react';

import './Sidebar.css';
import { getTags } from '../api/index';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { InputGroup, ListGroup, ListGroupItem, Toast, FormControl } from 'react-bootstrap';

function Sidebar({ user, links, tags, setTags, filteredTags, setFilteredTags, setFilteredLinks }) {
	const [searchStringValue, setSearchStringValue] = useState('');

	return (
		<Col id='sidebar' className='col-pixel-width-400'>
			<SideFilter
				tags={tags}
				setTags={setTags}
				filteredTags={filteredTags}
				setFilteredTags={setFilteredTags}
				searchStringValue={searchStringValue}
				setSearchStringValue={setSearchStringValue}
				links={links}
                setFilteredLinks={setFilteredLinks}
			/>
			<TagList
				user={user}
				links={links}
				tags={tags}
				setTags={setTags}
				filteredTags={filteredTags}
				setFilteredTags={setFilteredTags}
                setSearchStringValue={setSearchStringValue}
                setFilteredLinks={setFilteredLinks}
			/>
		</Col>
	);
}

function SideFilter({
	tags,
	links,
	setTags,
	filteredTags,
	setFilteredTags,
	searchStringValue,
    setSearchStringValue,
    setFilteredLinks
}) {
	//As the filter works the tags array gets smaller and smaller and when I undo the typing
	//it has no effect because the array doesn't have the prior elements any more.
	//Because this file seems to run completely every time I make a change anything I do gets reset.
	//Tried storing the array in a separate array, but it gets updated every time as well.

	const filterHandler = (event) => {
		setSearchStringValue(event.target.value);

		const filteredTagsArray = tags.filter((tag) => {
			if (tag.title.startsWith(event.target.value)) {
				return true;
			} else {
				return false;
			}
		});

        setFilteredTags(filteredTagsArray);

        const filteredLinksArray = links.filter(link => {
            let isAMatch = false;
            link.tags.forEach(tag => {
                if (tag.startsWith(event.target.value)) {
                    isAMatch = true;
                } 
            })
            return isAMatch;
		});
		setFilteredLinks(filteredLinksArray);
		
	};

	const resetHandler = () => {
		setFilteredTags(tags);
		setSearchStringValue('');
		setFilteredLinks(links);
	};

	return (
		<InputGroup className='mt-2 mb-2'>
			
				<FormControl
					type='text'
					value={searchStringValue}
					placeholder='Search tags...'
					onChange={filterHandler}
				/>
				<InputGroup.Append>
					<a href='#'><InputGroup.Text onClick={resetHandler} >x</InputGroup.Text></a>
				</InputGroup.Append>
			
			
		</InputGroup>
	);
}

function TagList({
	user,
	links,
	tags,
	setTags,
	filteredTags,
	setFilteredTags,
	setSearchStringValue,
	setFilteredLinks,
}) {
	useEffect(() => {
		getTags().then((result) => {
			setTags(result);
			setFilteredTags(result);
		});
	}, [links]);

	const tagClickHandler = (tag) => {
		setFilteredTags([tag]);
		setSearchStringValue('');
		const linksArray = links.filter(link => {
			let isMatch = false;
			link.tags.forEach(linkTag => {
				
				if (tag.title === linkTag) {
					isMatch = true;
				} 
			})
			return isMatch;
		})
		setFilteredLinks(linksArray);
	};

	const resetHandler = () => {
		setFilteredTags(tags);
		setSearchStringValue('');
		setFilteredLinks(links);
	};

	return (
		<>
			<div className='divider'></div>
			<Toast onClose={resetHandler} >
				<Toast.Header id='title'>
					<strong>Available Tags</strong>
				</Toast.Header>
				<Toast.Body>
					<ListGroup>
						{filteredTags.length
							? filteredTags.map((tag, i) => {
									return (
										<ListGroup.Item
											key={i}
											className='tagButton'
											action
											onClick={() => {
												tagClickHandler(tag);
											}}
										>
											{tag.title}
										</ListGroup.Item>
									);
							  })
							: ''}
					</ListGroup>
				</Toast.Body>
			</Toast>
		</>
	);
}

export default Sidebar;
