const express = require('express');
const linksRouter = express.Router();
const {
    getAllLinks,
    createLink,
    updateLink
} = require('../db');

const { requireUser } = require('./utils');

//linksRouter 

linksRouter.use((req, res, next) => {
    console.log("Making a request to /links");
    next();
})

// get all links

linksRouter.get('/', async (req, res, next) => {
    const links = await getAllLinks(req.user.id);
    res.send({
        links
    });
})

// add new link
linksRouter.post('/', requireUser, async (req, res, next) => {
    const { url, title, description, tags } = req.body;

    const creatorId = req.user.id;
    link = await createLink({ creatorId, url, title, description, tags });

    res.send(
        link
    );
});

// update link

linksRouter.patch('/:linkId', requireUser, async (req, res, next) => {

    const [link] = await getAllLinks(req.user.id, req.params.linkId);

    const { url, title, description, tags } = req.body;
    const updateFields = {};

    if (url) { updateFields.url = url }
    if (title) { updateFields.title = title }
    if (description) { updateFields.description = description }



    try {
        if (link && link.creatorId === req.user.id) {

            const updatedLink = await updateLink(link.id, updateFields, tags);
            // const updatedTags = await updateTags( link.id );

            res.send({
                link: updatedLink
                // tags: updatedTags
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = linksRouter