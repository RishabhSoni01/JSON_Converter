const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const {calculateAgeDistribution} = require('../controllers/usersController')

router.get('/', usersController.uploadData);
router.get('/age-distribution', usersController.calculateAgeDistribution);

module.exports = router;
