const apiRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;


const { getUserById } = require('../db/index.js');

const linksRouter = require('./links');
const usersRouter = require('./users');
const tagsRouter = require('./tags');
const linksTagsRouter = require('./links_tags');

apiRouter.use(async (req, res, next) => {
	console.log('entered the main router');
	
	const prefix = 'Bearer ';
	const auth = req.header('Authorization');

	

	if (!auth) {
		// nothing to see here
		next();
	} else if (auth.startsWith(prefix)) {
		const token = auth.slice(prefix.length);

		try {
			const { id } = jwt.verify(token, JWT_SECRET);

			if (id) {
				req.user = await getUserById(id);
				req.user.token = token;
				next();
			} else {
				next({ name: 'expired token', message: 'the token has expired. Log in again' });
			}
		} catch ({ name, message }) {
			next({ name, message });
		}
	} else {
		next({
			name: 'AuthorizationHeaderError',
			message: `Authorization token must start with ${prefix}`,
		});
	}
});

apiRouter.get('/', (req, res, next) => {
	res.send({
		message: 'API is under construction!',
	});
});



apiRouter.use('/links', linksRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/linkstags', linksTagsRouter);


apiRouter.use((error, req, res, next) => {
	res.status(500).send(error);
})

module.exports = apiRouter;
