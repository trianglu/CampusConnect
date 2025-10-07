const express = require('express');
const controller = require('../controllers/eventController');
const {isLoggedIn, isAuthor} = require('../middleware/auth');
const router = express.Router();
const {fileUpload} = require('../middleware/fileUpload');
const { validateResult, validateRsvp, validateEvent, validateId } = require('../middleware/validator');

router.get('/', controller.index);
router.get('/new', isLoggedIn, controller.new);
router.post('/', fileUpload, isLoggedIn, validateEvent, validateResult, controller.create);
router.get('/:id', validateId, controller.show);
router.post('/:id', fileUpload, /*validateId,*/ isLoggedIn, isAuthor, validateEvent, validateResult, controller.update);
router.post('/:id/rsvp', isLoggedIn, validateId, validateRsvp, validateResult, controller.handleRsvp);
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

module.exports = router;