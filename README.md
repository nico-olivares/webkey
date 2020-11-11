#Deployment
https://web-key.herokuapp.com/
(heroku puts the site to sleep after some time of inactivity so you may have to give it a few seconds to load the first time)

# WEB-KEY A web link bookmark app like no other
* By Brett Causey, John Marcello, and Nicolas Olivares
- Web-key allows you to keep all your favorite links in one place organized by tag names, by number of visits, or by alphabetical order.
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
    - id, user, url, title, clicks, description, date
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










