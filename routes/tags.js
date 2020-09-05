const express = require('express');
const { getLinksByTagName, getAllLinks } = require('../db');
const { requireUser } = require('./utils')
const tagsRouter = express.Router();

tagsRouter.get('/:tagName/links', requireUser, async (req, res, next) => {

    try {
        const tagName = await getLinksByTagName(req.params.tagName)
        const getLinks = await getAllLinks(tagName)
        res.send(getLinks)
    } catch (error) {
        throw error

    }
})
module.exports = tagsRouter