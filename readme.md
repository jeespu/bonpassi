RESTFUL ROUTES

name     url         method     description
=======================================================
INDEX    /dogs       GET        Display a list of all Dogs
NEW      /dogs/new   GET        Displays form to make a new dog
CREATE   /dogs       POST       Add new dog to DB
SHOW     /dogs/:id   GET        Shows info about one dog

INDEX    /campgrounds
NEW      /campgrounds/new
CREATE   /campgrounds
SHOW     /campgrounds/:id
# Nested routes
NEW      campgrounds/:id/comments/new  GET
CREATE   campgrounds/:id/comments/     POST

RESTful Routing

Rest - a mapping between HTTP routes and CRUD (create, read, update, destroy)

All routes: 
Name      Path          HTTP  Purpose
INDEX     /dogs         GET   List all dogs
NEW       /dogs/new     GET   Show new dog form
CREATE    /dogs         POST  Create new dog, then redirect somewhere
SHOW      /dogs:id      GET   Show info about one specific dog   
EDIT      /dogs/:id     GET   Show edit form for on dog
UPDATE    /dogs/:id     GET   Update a particular dog, then redirect somewhere
DESTROY   /destroy/:id  GET   Delete a particular dog, then redirect somewhere