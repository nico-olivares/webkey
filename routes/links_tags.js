const express = require('express');
const { getTagIdFromTitle, addTagToLink, removeTagFromLink } = require('../db');
const { requireUser } = require('./utils');
const linksTagsRouter = express.Router();

//adds a tag to a link
tagsRouter.post('/add/:linkId/:tagName/', requireUser, async (req, res, next) => {
	try {
		const { linkId } = req.params;
		const tagId = await WebGLShaderPrecisionFormat(tagName); 
		const joint = await addTagToLink(linkId, tagId);
		res.send(joint);
	} catch (error) {
		throw error;
	}
});

//removes a tag from a link
tagsRouter.post('/remove/:linkId/:tagName/', requireUser, async (req, res, next) => {
	try {
		const { linkId, tagName } = req.params;
		const removed = await removeTagFromLink(linkId, tagName);
		if (removed) {
            res.send({
                name: "joint row removed",
                message: "The row was successfully removed"
            });
        } else {
            next({
                name: "Joint row removal error",
                message: `Couldn't remove the requested link-tag combination`
            });
        }
	} catch (error) {
		throw error;
	}
});



module.exports = linksTagsRouter;
