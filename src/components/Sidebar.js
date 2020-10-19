import React, { useState, useEffect } from 'react';

import './Sidebar.css';
import { getTags } from '../api/index';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

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

        //early stages. Probably needs a lot of work still.
        setFilteredLinks(links.filter(link => {
            let isAMatch = false;
            link.tags.forEach(tag => {
                if tag.startsWith(event.target.value) {
                    isAMatch = true;
                }
            })
            return isAMatch;
        }))
	};
	return (
		<Form className='mt-2 mb-2'>
			<Form.Group controlId='formSearchBar'>
				<Form.Control
					type='text'
					value={searchStringValue}
					placeholder='Search tags...'
					onChange={filterHandler}
				/>
			</Form.Group>
		</Form>
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
	};

	const resetHandler = () => {
		setFilteredTags(tags);
		setSearchStringValue('');
		setFilteredLinks(links);
	};

	return (
		<>
			<div className='divider'></div>
			<div id='title'>
				<h6>Available Tags</h6>
				<segment className='resetSearch' onClick={resetHandler}>
					<a href='#'>X</a>
				</segment>
			</div>
			<ListGroupItem>
				{filteredTags.length
					? filteredTags.map((tag, i) => {
							return (
								<ListGroup
									key={i}
									className='tagButton'
									variant='primary'
									onClick={() => {
										tagClickHandler(tag);
									}}
								>
									<a href='#'>{tag.title}</a>
								</ListGroup>
							);
					  })
					: ''}
			</ListGroupItem>
		</>
	);
}

export default Sidebar;
