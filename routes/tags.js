const express = require('express');
const { getLinksByTagName, getAllLinks, destroyTag } = require('../db');
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
});

tagsRouter.delete('/:tagName', requireUser, async (req, res, next) => {
    try {
        const { tagName } = req.params;
        const result = await destroyTag(tagName);
        if (result) {
            res.send({
                name: "Destroyed",
                message: `The tag ${tagName} was destroyed`
            });
        } else {
            next({
                name: "Destroy tag error",
                message: `The tag ${tagName} couldn't be destroyed`
            });
        }
    } catch (error) {
        throw error;
    }


})




module.exports = tagsRouter