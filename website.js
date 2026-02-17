const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/routes');
const generalRoutes = require('./src/routes/generalRoute');
const db = require('./src/utils/db');

const app = express();
const PORT = 2001;

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('features'));
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', generalRoutes);
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});