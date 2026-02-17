const express = require('express');
const router = express.Router();
const multer = require('multer');
const email = require('../controllers/sendEmail');
const userController = require('../controllers/userController');
const toolController = require('../controllers/toolController');
const borrowerController = require('../controllers/borrowerController');
const facultyController = require('../controllers/facultyController');
const ratingsController = require('../controllers/ratingsController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

//Users
router.post('/createAccount', upload.single('profilePic'), userController.createAccount);
router.post('/checkAccount', userController.checkAccount);
router.post('/changePassword', userController.changePassword);
router.get('/getUsers', userController.getUsers);
router.put('/updateLic', upload.single('profilePic'), userController.updateLic);
router.delete('/deleteLic', userController.deleteLic);

//Send Email
router.post('/checkEmail', email.checkEmail);
router.post('/sendCode', email.sendCode);
router.post('/sendEmail', email.sendEmail);

//Get Tools Data
router.get('/getTools', toolController.getTools);
router.post('/addToolsEquipment', upload.single('toolPic'), toolController.addToolsEquipment);
router.get('/getToolDetails', toolController.getToolDetails);
router.put('/updateToolQuantity', toolController.updateToolQuantity);
router.put('/updateToolAvailability', toolController.updateToolAvailability);
router.post('/updateToolDetails', upload.single('imageUpload'), toolController.updateToolDetails);
router.delete('/deleteTool', toolController.deleteTool);

// Faculty
router.post('/addFaculty', facultyController.addFaculty);
router.get('/getFaculties', facultyController.getFaculties);
router.get('/getFaculty', facultyController.getFaculty);
router.put('/updateFaculty', facultyController.updateFaculty);
router.delete('/deleteFaculty', facultyController.deleteFaculty);

//Borrower
router.post('/borrowRequest', borrowerController.borrowRequest);
router.get('/getBorrowers', borrowerController.getBorrowers);
router.get('/getBorrower', borrowerController.getBorrower);
router.put('/confirmRequest', borrowerController.confirmRequest);
router.put('/declineRequest', borrowerController.declineRequest);
router.put('/returned', borrowerController.returned);
router.put('/onHoldBorrower', borrowerController.onHoldBorrower);

//Ratings
router.post('/addRating', ratingsController.addRating);
router.get('/getRatings', ratingsController.getRatings);

module.exports = router;