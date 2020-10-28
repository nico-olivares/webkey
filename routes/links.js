const express = require('express');
const linksRouter = express.Router();
const { getAllLinks, createLink, updateLink } = require('../db');

const { requireUser } = require('./utils');

//linksRouter

linksRouter.use((req, res, next) => {
	console.log('entered links router');
	next();
});

// get all links

linksRouter.get('/', requireUser, async (req, res, next) => {
	console.log('getting to the router get all links');
	try {
		const links = await getAllLinks(req.user.id);
		if (links) {
			return res.send({
				links,
			});
		} else {
			return res.send([]);
		}
	} catch (err) {
		next(err);
	}
});

// add new link
linksRouter.post('/', requireUser, async (req, res, next) => {
    
	try {
		const { url, title, description, tags } = req.body;
		const creatorId = req.user.id;

		[ link ] = await createLink({ creatorId, url, title, description, tags });
        
		res.send(link);
	} catch (error) {
		throw error;
	}
});

// update link

linksRouter.patch('/:linkId', requireUser, async (req, res, next) => {
	const [link] = await getAllLinks(req.user.id, req.params.linkId);
	const { url, title, description, tags } = req.body;
	const updateFields = {};

	if (url) {
		updateFields.url = url;
	}
	if (title) {
		updateFields.title = title;
	}
	if (description) {
		updateFields.description = description;
	}

	try {
		if (link && link.creatorId === req.user.id) {
			const updatedLink = await updateLink(link.id, updateFields, tags);
			res.send({
				link: updatedLink,
			});
		}
	} catch ({ name, message }) {
		next({ name, message });
	}
});

module.exports = linksRouter;
