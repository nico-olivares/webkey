// set up depedent react and dom components
// set up useState and useEffect

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// set up boostrap css

import 'bootstrap/dist/css/bootstrap.min.css';

// set up global containers

import Header from '../components/Header';
import Footer from '../components/Footer';

// set up page/view level containers

import { getLinks, getTags, getUserByToken } from '../api';
import Main from '../components/Main';
import Login from '../pages/Login';
import Register from '../pages/Register';

// set up top level app component

const App = () => {
	const [links, setLinks] = useState([]);
	const [filteredLinks, setFilteredLinks] = useState([]);
	const [tags, setTags] = useState([]);
	const [filteredTags, setFilteredTags] = useState([]);
	const [user, setUser] = useState({ username: '', token: 'token' });

	//user verification
	async function localStorageUser() {
		if (localStorage.getItem('webkey-user')) {
			const localStorageUser = JSON.parse(localStorage.getItem('webkey-user'));
			const newUser = await getUserByToken(localStorageUser.token); //{id, username}
			return newUser;
		} else {
			return { username: '', token: 'token' };
		}
	}
	useEffect(() => {
		localStorageUser().then((result) => {
			setUser(result);
		});
	}, []);

	useEffect(() => {
		if (user.username !== '') {
			getLinks()
				.then((response) => {
					setLinks(response);
					setFilteredLinks(response);
				})
				.catch((error) => {
					setLinks(error);
				});
			getTags()
				.then((result) => {
					setTags(result);
					setFilteredTags(result);
				})
				.catch((error) => {
					setTags(error);
				});
		}
		
	}, [user]);

	return (
		<div className='App'>
			<Router>
				<Header user={user} setUser={setUser} />
				{user.username === '' ? (
					<Switch>
						<Route
							path='/login'
							exact
							render={() => <Login user={user} setUser={setUser} />}
						/>
						<Route
							path='/register'
							exact
							render={() => <Register user={user} setUser={setUser} />}
						/>
						<Redirect to='/login' />
					</Switch>
				) : (
					<Switch>
						<Route
							path='/'
							exact
							render={() => (
								<Main
									user={user}
									links={links}
									setLinks={setLinks}
									tags={tags}
									setTags={setTags}
									filteredTags={filteredTags}
									setFilteredTags={setFilteredTags}
									filteredLinks={filteredLinks}
									setFilteredLinks={setFilteredLinks}
								/>
							)}
						/>
						<Redirect to='/' />
					</Switch>
				)}

				<Footer />
			</Router>
		</div>
	);
};

export default App;
