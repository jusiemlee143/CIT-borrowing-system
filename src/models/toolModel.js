const mongoose = require('../utils/db');

const toolSchema = new mongoose.Schema({
    name: String,
    description: String,
    quantity: Number,
    price: Number,
    availability: String,
    img: String,
},{
    versionKey: false,
});

const ToolModel = mongoose.model('tools', toolSchema);

module.exports = ToolModel;