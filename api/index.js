const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('../src/routes/routes');
const generalRoutes = require('../src/routes/generalRoute');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ static files (serverless-safe)
app.use(express.static(path.join(__dirname, '../features')));
app.use(express.static(path.join(__dirname, '../assets')));

// routes
app.use('/', generalRoutes);
app.use('/', routes);

module.exports = app;
