const express = require('express');
const linksRouter = express.Router();
const { getAllLinks, createLinks, getLinksByTagName } = require('../db');

//linksRouter 

linksRouter.use((req, res, next) => {
    console.log("a request is being made to links");
    next();
})

linksRouter.get('/', async (req, res, next) => {
    const links = await getAllLinks();
    res.send({
        links
    });
})

module.exports = linksRouter