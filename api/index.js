const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../src/routes/routes');
const generalRoutes = require('../src/routes/generalRoute');

const app = express();

// middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// static files (optional)
app.use('/features', express.static('features'));
app.use('/assets', express.static('assets'));

// routes
app.use('/', generalRoutes);
app.use('/', routes);

// 🚨 VERY IMPORTANT: export the app (NO app.listen)
module.exports = app;
