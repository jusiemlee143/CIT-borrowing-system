const mongoose = require('../utils/db');

const borrowerSchema = new mongoose.Schema({
    studentName: String,
    groupNumber: Number,
    section: String,
    dateBorrowed: String,
    timeBorrowed: String,
    instructor: String,
    activityTitle: String,
    tools: Array,
    memberNames: Array,
    facultyConfirmed: Boolean,
    requestConfirmed: Boolean,
    returned: Boolean,
    dateReturned: String,
    timeReturned: String,
    dateOnHold: String,
    timeOnHold: String,
    damageTools: Array,
    damage: Boolean,
    lostTools: Array,
    lost: Boolean,
},{
    versionKey: false,
});

const BorrowerModel = mongoose.model('borrowers', borrowerSchema);

module.exports = BorrowerModel;