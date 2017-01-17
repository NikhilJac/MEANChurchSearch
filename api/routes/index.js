var express = require('express');
var router = express.Router();

var ctrlChurches = require('../controllers/churches.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');

// Church routes
router
  .route('/churches')
  .get(ctrlChurches.churchesGetAll)
  .post(ctrlChurches.churchesAddOne);

router
  .route('/churches/:churchId')
  .get(ctrlChurches.churchesGetOne)
  .put(ctrlChurches.churchesUpdateOne);


// Review routes
router
  .route('/churches/:churchId/reviews')
  .get(ctrlReviews.reviewsGetAll)
  .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);

router
  .route('/churches/:churchId/reviews/:reviewId')
  .get(ctrlReviews.reviewsGetOne)
  .put(ctrlReviews.reviewsUpdateOne);

// Authentication
router
  .route('/users/register')
  .post(ctrlUsers.register);

  router
    .route('/users/login')
    .post(ctrlUsers.login);

module.exports = router;
