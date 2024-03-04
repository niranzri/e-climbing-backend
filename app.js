require('dotenv').config(); //gets access to environment variables

const express = require('express'); // imports express from express
const app = express(); // creates an express server instance named 'app'

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const indexRoutes = require('./routes/index.routes');
app.use("/api", indexRoutes);

const authRoutes = require('./routes/auth.routes');
app.use("/auth", authRoutes);

module.exports = app;