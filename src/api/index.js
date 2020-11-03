import userUtil from '../utils/user';
import axios from 'axios';

export async function getLinks() {
	
	try {
		const { token } = userUtil.getUserFromStorage();
		const {
			data: { links },
		} = await axios.get('/api/links', {
			headers: {
				authorization: 'Bearer ' + token,
			},
		});
		return links;
	} catch (error) {
		throw error;
	}
}

export async function register({ username, password }) {
	
	try {
		const {
			data: { user: newUser },
		} = await axios.post('/api/users/register', {
			username: username,
			password: password,
		});
		
		if (newUser) {
			localStorage.setItem('user', JSON.stringify(newUser));
			return newUser;
		} else {
			return {message: 'Please login to access these features.'};
		}
	} catch (error) {
		throw error;
	}
}

export async function login({ username, password }) {
	try {
		const {
			data: { user },
		} = await axios.post('api/users/login', {
			username,
			password,
		});
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
			return user;
		}
	} catch (error) {
		throw error;
	}
}

export async function getUserByToken(token) {
	
	try {
		const { data: user } = await axios.get('api/users', { headers: { authorization: 'Bearer ' + token } });
		
		if (user) {
			return user;
		} else {
			return {};
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getTags() {
	try {
		const user = userUtil.getUserFromStorage();
		const { data: tags } = await axios.get('/api/tags/usertags', {
			headers: {
				authorization: 'Bearer ' + user.token,
			},
		});
		if (tags) {
			tags.sort((a, b) => {
				if (a.title[0] - b.title[0] === 0) {
					if (a.title[1] - b.title[1] === 0) {
						return a.title[2] - b.title[2];
					} else {
						return a.title[1] - b.title[1];
					}
				} else {
					return a.title[0] - b.title[0];
				}
			});
			return tags;
		} else {
			return [];
		}
	} catch (error) {
		throw error;
	}
}

export async function addNewLink({ title, description, url, tags = [] }) {
	
	try {
		const user = userUtil.getUserFromStorage();
		const { data: link } = await axios.post('api/links', { title,
			description,
			url,
			tags} , {headers: {
				authorization: 'Bearer ' + user.token,
			} 
		});
		if (link) {
			return link;
		} else {
			return {};
		}
	} catch (error) {
		throw error;
	}
}

export async function updatedLink({ id, url, title, description, tags = [] }, token) {
	try {
		
		const { data: link } = await axios.patch(`api/links/${id}`, {
			url,
			title,
			description,
			tags,
		}, {headers: { authorization: 'Bearer ' + token}});
		if (link) {
			return link;
		} else {
			return {};
		}
	} catch (error) {
		throw error;
	}
}

//working
export async function updateClicks(linkId, token) {
	
	try {
		const { data: [link] } = await axios.patch(`api/links/click/${linkId}`, {}, { headers: { authorization: "Bearer " + token}});
		if (link) {
			return link;
		} else {
			return {};
		}
	} catch (error) {
		console.error(error);
	}
}
