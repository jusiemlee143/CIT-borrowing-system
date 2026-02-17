const RateModel = require('../models/ratingsModel'); // Adjust the path as needed

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

// Routes
exports.addRating = async (req, res) => {
    const { name, starRating, feedback } = req.body;
    try {
        if(!name && !starRating && !feedback){
            return res.status(400).json({error: 'No Value'});
        }
        await RateModel.create({
            name: name,
            rating: starRating,
            feedback: feedback
        });
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getRatings = async (req, res) => {
    try {
        const ratings = await RateModel.find({});
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};