const mongoose = require('../utils/db');

const rateSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    feedback: String,
},{
    versionKey: false,
});

const RateModel = mongoose.model('ratings', rateSchema);

module.exports = RateModel;