const nodemailer = require('nodemailer');
const fs = require('fs');
const UserModel = require('../models/userModel');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "imbagalaxy0@gmail.com", // Update with your email credentials
        pass: "ianc uham axeb guwf"  // Update with your email password
    }
});

exports.checkEmail = async (req, res) => {
    const { email } = req.body;
    try{
        const existingEmail = await UserModel.findOne({ email});
        
        if(!existingEmail){
            return res.status(404).json({ exists: false });
        }
        else{
            return res.status(200).json({ exists: true});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.sendEmail = async (req, res) => {
    try {
        const { email, borrowerData } = req.body;
        
        const encodedBorrowerData = encodeURIComponent(JSON.stringify(borrowerData));
        const link = `http://localhost:2001/templates/emailDetails.html?borrower=${encodedBorrowerData}`;

        // Construct the email content with the link included
        const emailContent = `
            <h1>To Confirm Please click the link</h1>
            <p>Please click on the following link to view the borrower details:</p>
            <a href="${link}">View Borrower Details</a>
        `;

        await transporter.sendMail({
            from: '"You" <***-example-person@gmail.com>',
            to: email,
            subject: "Borrowing Verification",
            html: emailContent,
        });
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.sendCode = async (req, res) => {
    const { email, code } = req.body;
    try {
        await transporter.sendMail({
            from: '"You" <***-example-person@gmail.com>',
            to: email,
            subject: "Verification Code",
            text: `Your verification code is: ${code}`,

        });
        res.send('Code sent successfully');
    } catch (error) {
        console.error('Error sending code:', error);
        res.status(500).send('Internal Server Error');
    }
};