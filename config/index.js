const express = require('express') // import to have access to the `body` property in requests

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require('morgan')

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require('cookie-parser')

// ℹ️ Needed to accept from requests from 'the outside'. CORS stands for cross origin resource sharing
// unless the request if from the same domain, by default express wont accept POST requests
const cors = require('cors')

const FRONTEND_URL = process.env.ORIGIN || 'http://localhost:5173'

// Middleware configuration
module.exports = app => {
  // Because this is an app that will be hosted on a server with a `proxy`, we tell express to trust the proxy settings. 
  // Services like heroku (platform at a service PaaS) use proxies.
  app.set('trust proxy', 1)

  // cross-origin resource sharing middleware:
  // controls a very specific header to pass headers from the frontend; only requests from FRONTEBD_URL are allowed. 
  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  )

  // In development environment the app logs
  app.use(logger('dev'))

  // middleware fucntion that serves static files from the "public" directory. 
  app.use(express.static("public"));

  // middleware functions to have access to `body` property in the request
  app.use(express.json()) // parses incoming requests with a JSON payload and populates the req.body with the parsed data.
  app.use(express.urlencoded({ extended: false })) // parses incoming URL-encoded form data. 
  app.use(cookieParser()) // parses HTTP cookies from the request headers and males them available in the req.cookies object. 
}
