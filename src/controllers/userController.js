const bcrypt = require('bcrypt');
const fs = require('fs');
const UserModel = require('../models/userModel');

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.createAccount = async (req, res) => {
    const {name, birthday, email, courseYear, generateCode, idNumber, password, admin} = req.body;
    try{
        const existingUser = await UserModel.findOne({generateCode});
        const existingEmail = await UserModel.findOne({email});
        if(existingUser || existingEmail){
            return res.status(400).json({error: "User already exists. Please choose a different username or email"});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const img = req.file.filename;
            await UserModel.create({
                img: img,
                name: name,
                birthday: birthday,
                email: email,
                courseYear: courseYear,
                username: generateCode,
                password: hashedPassword,
                admin: admin,
                idNumber: idNumber,

            });
            return res.status(201).json({ message: 'Account created successfully' });
        }
    } catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.checkAccount = async (req, res) => {
    const {username, password} = req.body;
    try{
        const existingUser = await UserModel.findOne({ username});
        if(existingUser){

            const passwordMatch = await bcrypt.compare(password, existingUser.password);

            if(passwordMatch){
                const isAdmin = existingUser.admin;
                return res.status(200).json({ message: 'Login Successful', isAdmin });
            }
            else{
                return res.status(400).json({error: "Invalid Password!"});
            }
        }
        else{
            return res.status(400).json({error: "Invalid Username!"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.changePassword = async (req, res) => {
    const { email, confirmPassword } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(confirmPassword, 10);
        const updatedUser = await UserModel.findOneAndUpdate(
            {email: email},
            {password: hashedPassword},
            {new: true}
        );
        if(!updatedUser){
            return res.status(404).json({error: "User not found!"});
        }
        return res.status(200).json({message: "Password changed successfully" });
    }catch(error){
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.getUsers = async (req, res) => {
    try {
        let query = {};
        if (req.query.query) {
            const escapedQuery = escapeRegExp(req.query.query);
            query = { 
                $or: [
                    { name: { $regex: new RegExp(escapedQuery, 'i') } },
                    { username: { $regex: new RegExp(escapedQuery, 'i') } },
                    { email: { $regex: new RegExp(escapedQuery, 'i') } },
                    { courseYear: { $regex: new RegExp(escapedQuery, 'i') } },
                    { birthday: { $regex: new RegExp(escapedQuery, 'i') } },
                    { idNumber: { $regex: new RegExp(escapedQuery, 'i') } }
                ]
            };
        }
        const users = await UserModel.find(query); 
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.updateLic = async (req, res) => {
    const userId = req.query.id;
    const updatedUserData = req.body;
    const newImageFilename = req.file ? req.file.filename : null;

    if (newImageFilename) {
        const user = await UserModel.findById(userId);

        if (newImageFilename && user.img) {
            // Remove the old image file from the filesystem
            fs.unlinkSync(`assets/images/${user.img}`);
        }
        // Update the user data
        updatedUserData.img = req.file.filename;
    }
    try {
        const updatedLic = await UserModel.findByIdAndUpdate(
            userId,
            updatedUserData,
            { new: true }
        );
        if (!updatedLic) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "LIC data updated successfully", updatedLic });
    } catch (error) {
        console.error('Error updating LIC data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteLic = async (req, res) => {
    const userId = req.query.id;
    try {
        const deletedLic = await UserModel.findByIdAndDelete(userId);
        if (!deletedLic) {
            return res.status(404).json({ error: "User not found" });
        }
        fs.unlinkSync(`assets/images/${deletedLic.img}`);
        return res.status(200).json({ message: "LIC data deleted successfully", deletedLic });
    } catch (error) {
        console.error('Error deleting LIC data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};