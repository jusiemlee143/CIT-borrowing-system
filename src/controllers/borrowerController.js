const BorrowerModel = require("../models/borrowerModel");
const ToolModel = require('../models/toolModel');

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.borrowRequest = async (req, res) => {
    const {studentName, section, groupNumber, dateBorrowed, timeBorrowed, activityTitle, instructor, tools, memberNames, requestConfirmed, returned} = req.body;
    try{
        const existingRequest = await BorrowerModel.findOne({ studentName: studentName, requestConfirmed: false });
        const toolNotReturned = await BorrowerModel.findOne({ studentName: studentName, requestConfirmed: true, returned: false });
        if(toolNotReturned){
            return res.status(409).json({ error: 'Please return borrowed tools before borrowing again' });
        }
        if(existingRequest){
            return res.status(409).json({ error: 'One request per Student only' });
        }else{
            const borrower = await BorrowerModel.create({
                studentName: studentName,
                groupNumber: groupNumber,
                section: section,
                dateBorrowed: dateBorrowed,
                timeBorrowed: timeBorrowed,
                instructor: instructor,
                activityTitle: activityTitle,
                tools: tools,
                memberNames: memberNames,
                facultyConfirmed: false,
                requestConfirmed: requestConfirmed,
                returned: returned,
            });
            return res.status(201).json({ message: 'Request submitted', borrower });
        }
        
    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getBorrowers = async (req, res) => {
    try{
        let query = {};
        let sectionQuery = {};
        if(req.query.query){
            const escapedQuery = escapeRegExp(req.query.query);
            query = { 
                $or: [
                    { studentName: { $regex: new RegExp(escapedQuery, 'i') } },
                    { instructor: { $regex: new RegExp(escapedQuery, 'i') } },
                    { section: { $regex: new RegExp(escapedQuery, 'i') } },
                    { dateBorrowed: { $regex: new RegExp(escapedQuery, 'i') } },
                    { dateReturned: { $regex: new RegExp(escapedQuery, 'i') } },
                    { dateOnHold: { $regex: new RegExp(escapedQuery, 'i') } }
                ]    
            };
        }
        if(req.query.section){
            sectionQuery = { section: req.query.section };
        }
        const borrowers = await BorrowerModel.find({ $and: [query, sectionQuery] });
        const allRequestConfirmed = borrowers.every(borrower => borrower.requestConfirmed === true);
        const allReturned = borrowers.every(borrower => borrower.returned === true);
        const returnedBorrower = borrowers.find(borrower => borrower.returned === true);
        const isDamageLost = borrowers.some(borrower => borrower.damaged === true || borrower.lost === true);
        res.status(200).json({ 
            borrowers: borrowers, 
            allRequestConfirmed: allRequestConfirmed, 
            allReturned: allReturned, 
            returnedBorrower: returnedBorrower,
            isDamageLost: isDamageLost,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error'});
    }
};

exports.getBorrower = async (req, res) => {
    const { id } = req.query;
    try{
        const borrower = await BorrowerModel.findOne({_id: id});
        res.json(borrower);
    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.confirmRequest = async (req, res) => {
    const { _id } = req.body;
    const faculty = req.query.faculty;
    try{
        if(faculty){
            await BorrowerModel.findByIdAndUpdate(
                { _id: _id},
                {facultyConfirmed: true}
             );
        }
        else{
            await BorrowerModel.findByIdAndUpdate(
                { _id: _id},
                {requestConfirmed: true}
             );
        }
        res.json({message: 'Request Confirmed'})

    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.declineRequest = async (req, res) => {
    const { _id, tools} = req.body;
    try{
        for (const tool of tools) {
            await ToolModel.findOneAndUpdate(
                { name: tool.toolName }, 
                { $inc: { quantity: tool.quantity }},
                { new: true }
            );
        }

        await BorrowerModel.findOneAndDelete({_id});

        res.json({message: 'Request Declined'})

    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.returned = async (req, res) => {
    const { _id, returned, dateReturned, timeReturned} = req.body;
    try{
        await BorrowerModel.findOneAndUpdate(
            {_id: _id},
            {
                $set:{
                    returned: returned,
                    dateReturned: dateReturned,
                    timeReturned: timeReturned,
                }
            }
         );
         res.json({message: 'Tools/Equipments Returned'})
    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.onHoldBorrower = async (req, res) => {
    const { studentNameObject } = req.body;
    try{
        let updateObject = {};

        if (studentNameObject.damageTools) {
            updateObject.damageTools = studentNameObject.damageTools;
            updateObject.damage = true;
        }

        if (studentNameObject.lostTools) {
            updateObject.lostTools = studentNameObject.lostTools;
            updateObject.lost = true;
        }
        updateObject.dateOnHold = studentNameObject.dateOnHold;
        updateObject.timeOnHold = studentNameObject.timeOnHold;

        await BorrowerModel.findOneAndUpdate(
            {_id: studentNameObject._id},
            {
                $set: updateObject
            }
         );
        res.json({message: 'Request Confirmed'});
    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};