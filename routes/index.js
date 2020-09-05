const apiRouter = require('express').Router();
const linksRouter = require('./links');
const usersRouter = require('./users');

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!"
  });
});
apiRouter.use('/links', linksRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
