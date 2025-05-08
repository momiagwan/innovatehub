const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUnverifiedInvestors, verifyInvestor } = require('../controllers/adminController');

router.get('/unverified', auth, getUnverifiedInvestors);
router.post('/verify/:id', auth, verifyInvestor);

module.exports = router;