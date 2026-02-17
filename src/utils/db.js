const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/soft_dev2');

const db = mongoose.connection;

db.on('error', ()=> console.log('Error in Connecting Database'));
db.once('open', ()=> console.log('Connected to the Database'));

module.exports = mongoose;