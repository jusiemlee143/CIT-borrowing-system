const FacultyModel = require('../models/facultyModel');

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
exports.addFaculty = async (req, res) => {
    const { name, idNumber, email, schedules } = req.body;
    try {
        const existingFaculty = await FacultyModel.findOne({ name });
        if (existingFaculty) {
            return res.status(400).json({ error: 'This faculty already exists' });
        } else {
            await FacultyModel.create({
                name: name,
                idNumber: idNumber,
                email: email,
                schedules: schedules
            });
            return res.status(201).json({ message: 'Faculty added successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getFaculties = async (req, res) => {
    try {
        let query = {};
        if (req.query.query) {
            const escapedQuery = escapeRegExp(req.query.query);
            query = {
                 $or: [
                    { name: { $regex: new RegExp(escapedQuery, 'i') } },
                    { idNumber: { $regex: new RegExp(escapedQuery, 'i') } }
                 ] 
                };
        }
        const faculties = await FacultyModel.find(query); 
        res.status(200).json(faculties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getFaculty = async (req, res) => {
    const { id } = req.query;
    try{
        const faculty = await FacultyModel.findOne({_id: id});
        res.json(faculty);
    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteFaculty = async (req, res) => {
    const id = req.query.id;
    try {
        const deleteFaculty = await FacultyModel.findByIdAndDelete(id);

        if (!deleteFaculty) {
            res.status(404).json({ error: "Tool/Equipment not found" });
        }

        return res.status(200).json({ message: `Faculty(${deleteFaculty.name}) data deleted successfully`,  });
    } catch (error) {
        console.error('Error deleting faculty:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateFaculty = async (req, res) => {
    const id = req.query.id;
    const { name, idNumber, email, schedules } = req.body;
    try {
        const updateFaculty = await FacultyModel.findByIdAndUpdate(
            id,
            { 
                $set: {
                    name: name,
                    idNumber: idNumber,
                    email: email,
                    schedules: schedules
                }
             },
            { new: true }
        );

        if (!updateFaculty) {
            return res.status(404).json({ error: "Faculty not found" });
        }

        return res.status(200).json({ message: "Faculty updated successfully", faculty: updateFaculty });
    } catch (error) {
        console.error('Error updating faculty:', error);
        res.status(500).send('Internal Server Error');
    }
};