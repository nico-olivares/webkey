const express = require('express');
const linksRouter = express.Router();
const { 
    getAllLinks, 
    createLinks, 
    getLinksByTagName 
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
    const creatorId = req.user.id;
    link = await createLink({ creatorId, url, title, comments });
    
    res.send ({
        link
    });
})

module.exports = linksRouter