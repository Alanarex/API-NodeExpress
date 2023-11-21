const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const shuffleController = require('../controllers/shuffleController'); // Import the teamController

router.get('/add', userController.addUser);
router.get('/showAll', userController.showAllUsers);
router.get('/search/:teamId', userController.searchUser);
router.get('/update', userController.updateUser);
router.get('/delete', userController.deleteUser);
router.get('/shuffle', shuffleController.shuffleUsersToTeams);

module.exports = router;
