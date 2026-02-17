const mongoose = require('../utils/db');

const toolSchema = new mongoose.Schema({
    subjectCode: String,
    section: String,
    day: String,
    startTime: String,
    endTime: String,
}, { _id: false }); // No need for _id in subdocuments

const facultySchema = new mongoose.Schema({
    name: String,
    idNumber: String,
    email: String,
    schedules: [toolSchema],
},{
    versionKey: false,
});

const FacultyModel = mongoose.model('faculty', facultySchema);

module.exports = FacultyModel;
