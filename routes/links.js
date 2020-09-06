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
    const links = await getAllLinks();
    res.send({
        links
    });
})

// add new link
linksRouter.post('/', requireUser, async (req,res, next) => {
    const { url, title, comments } = req.body;
    console.log ('url', url);
    const creatorId = req.user.id;
    link = await createLink({ creatorId, url, title, comments });
    
    res.send (
        link
    );
});

// update link

linksRouter.patch('/:linkId', requireUser, async (req, res, next) => {
    const [link] = await getAllLinks(req.params.linkId);
    const { url, title, comments  } = req.body;
    const updateFields = {};

    if(url) { updateFields.url = url }
    if(title) { updateFields.title = title }
    if(comments) { updateFields.comments = comments }

    try {
        if(link && link.creatorId === req.user.id) {
            console.log('link creator id = ', link.creatorId);
            console.log('req user id = ', req.user.id); 
            
            const updatedLink = await updateLink( link.id, updateFields );
            res.send({
                link: updatedLink
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = linksRouter