# WEB-KEY A web link bookmark app like no other
* By Brett Causey, John Marcello, and Nicolas Olivares
Web-key allows you to keep all your favorite links in one place organized by tag names, by number of visits, or by alphabetical order.
Each link has a title, the actual link, and a description and will store the number of times the link has been accessed from the app and the date the link was last accessed.

# Functionality (1. Front-end, 2. Middleware, 3. Back-end)
- Create a user account
1. Enter username and password (twice) to create a user account amd get a token. 
2. Uses the users rout (post) api/users/register to send username and password. Password is hashed and token returned.
3. createUser({ username, password }) returns the user object

- Log in to user account
1. Enter username and password to log in and get a token.
2. Uses the users rout (post) api/users/login to send username and password. It compares the password to the hashed password in the database and if they match it returns a token.
3. getUser({ username, password }) returns the user object

- By default main view shows all links sorted by your last sorting choice (alphabetical, clicks, date visited)
1. Fetches all the links that belong to the user (with tags)
2. Uses the links rout (get) api/links to get all the links with tags that belong to the user. Checks that user is registered.
3. getAllLinks(userId) returns all the links with their tags

- Tag filtering. Tags will be displayed in a left panel. Clicking on a tag will filter all links to only show those that have that tag in it.
1. It will filter the already present complete list of links by showing only the ones that have the clicked tag
2. N/A
3. N/A

- Add a new link. 
1. Adds link title, url, description, and tags to create a new link.
2. Uses the link rout (post) api/links to get the information from the front end and send it to the back end. It adds clicks and date. It checks that the user is registered.
3. createLink({ creatorId, url, title, description, tags }), returns the new link object with the tags attached to it.

- Update an existing link
1. Updates a link with an option of title, url, description, and/or tags
2. Uses the rout (patch) api/links/:linkId. It checks that the user is registered and that the link belongs to the user.
3. updateLink( link.id, updateFields, tags ), returns the newly updated link with its tags attached.


# Database Tables

1. users
    - id, username, password
2. links
    - id, user, url, title, clicks, comments, date
3. tags
    - id, title
4. links_tags
    - linkId, tagId


# React components

Link To Architecture
https://docs.google.com/document/d/1UagpYQfgaTIfS0UhGi5mJ5TN3rYS3jvF0OL6UzUEp4o/edit



# Database Methods & Functions

### /db/index.js  

updateLink(linkId, fields={})
    - Updates any or all of the link fields except for id, clicks, and date
    - It returns the modified link with its tags

getAllLinksByUser(userId, linkId = null)  ** needs to be modified
    - Returns either all of the links for a given user if linkId is null, or a single link if userId and linkId are provided and match

createLink({ url, title, clicks (change to nothing), comments, date, tags=[] })
    - Creates new links and if tags is not null it adds tags to the links
    - It returns the newly created link without the tags in it

createTag(title)
    - Creates a new tag (tags table)
    - Returns the newly created tag

addTagToLink(linkId, tagId)
    - It connects a linkId to a tagId
    - It returns the newly created joint table row

getLinksByTagName(userId, tagName)  ** needs to be modified
    - Provided a userId and tag name it returns all the links that match





# Routes









# Our Story
1. add comments to links unique not null
2. add dates to links.
3. get all links.
4. add links













# The Smallest Starting Point

So, you want to build a full-stack JavaScript application with:

- An Express web server
- A PostgreSQL database
- A React front-end

And you want it to work locally as well as be easy to deploy?

We've got your back:

## Local Development

### Setting Up

First, clone this repo locally, then remove the current `.git` folder. Follow this up with making it a new git repo.

```bash
rm -rf .git

git init
```

Then go to GitHub, create a new repository, and add that remote to this local repo.

Then, run `npm install` to install all node modules.

You should decide on a name for your local testing database, and edit `db/index.js` changing the value of `DB_NAME`.

Once you decide on that name, make sure to run `createdb` from your command line so it exists (and can be connected to).

Finally you can run `npm run server:dev` to start the web server.

In a second terminal navigate back to the local repo and run `npm run client:dev` to start the react server. 

This is set up to run on a proxy, so that you can make calls back to your `api` without needing absolute paths. You can instead `axios.get('/api/posts')` or whatever without needing to know the root URL.

Once both dev commands are running, you can start developing... the server restarts thanks to `nodemon`, and the client restarts thanks to `react-scripts`.

### Project Structure

```bash
├── db
│   ├── index.js
│   └── init_db.js
├── index.js
├── package.json
├── public
│   └── index.html
├── routes
│   └── index.js
└── src
    ├── api
    │   └── index.js
    ├── components
    │   ├── App.js
    │   └── index.js
    └── index.js
```

Top level `index.js` is your Express Server. This should be responsible for setting up your API, starting your server, and connecting to your database.

Inside `/db` you have `index.js` which is responsible for creating all of your database connection functions, and `init_db.js` which should be run when you need to rebuild your tables and seed data.

Inside `/routes` you have `index.js` which is responsible for building the `apiRouter`, which is attached in the express server. This will build all routes that your React application will use to send/receive data via JSON.

Lastly `/public` and `/src` are the two puzzle pieces for your React front-end. `/public` contains any static files necessary for your front-end. This can include images, a favicon, and most importantly the `index.html` that is the root of your React application.

### Command Line Tools

In addition to `client:dev` and `server:dev`, you have access to `db:build` which (you will write to) rebuilds the database, all the tables, and ensures that there is meaningful data present.

## Deployment

### Setting up Heroku (once)

```bash
heroku create hopeful-project-name

heroku addons:create heroku-postgresql:hobby-dev
```

This creates a heroku project which will live at https://hopeful-project-name.herokuapp.com (note, you should change this to be relevant to your project).

It will also create a postgres database for you, on the free tier.


### Deploying

Once you've built the front-end you're ready to deploy, simply run `git push heroku master`. Note, your git has to be clean for this to work (which is why our two git commands live as part of getting ready to deploy, above).

This will send off the new code to heroku, will install the node modules on their server, and will run `npm start`, starting up your express server.

If you need to rebuild your database on heroku, you can do so right now with this command:

```bash
heroku run npm run db:build
```

Which will run `npm run db:build` on the heroku server.

Once that command runs, you can type `heroku open` to get a browser to open up locally with your full-stack application running remotely.
