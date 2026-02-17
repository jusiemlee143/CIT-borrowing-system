const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
    });
    res.sendFile(path.join(__dirname, '../../features/landingPage.html'));
});

module.exports = router;