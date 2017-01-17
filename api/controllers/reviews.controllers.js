var mongoose = require('mongoose');
var Church = mongoose.model('Church');


// GET all reviews for a hotel
module.exports.reviewsGetAll = function(req, res) {
  var id = req.params.churchId;
  console.log('GET reviews for churchId', id);

  Church
    .findById(id)
    .select('reviews')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding church");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("Church id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Church ID not found " + id
        };
      } else {
        response.message = doc.reviews ? doc.reviews : [];
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

// GET single review for a hotel
module.exports.reviewsGetOne = function(req, res) {
  var churchId = req.params.churchId;
  var reviewId = req.params.reviewId;
  console.log('GET reviewId ' + reviewId + ' for churchId ' + churchId);

  Church
    .findById(churchId)
    .select('reviews')
    .exec(function(err, church) {
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding church");
        response.status = 500;
        response.message = err;
      } else if(!church) {
        console.log("Church id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Church ID not found " + id
        };
      } else {
        // Get the review
        response.message = church.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message);
    });

};

var _addReview = function (req, res, church) {
  church.reviews.push({
    name : req.body.name,
    rating : parseInt(req.body.rating, 10),
    review : req.body.review
  });

  church.save(function(err, churchUpdated) {
    if (err) {
      res
        .status(500)
        .json(err);
    } else {
      res
        .status(200)
        .json(churchUpdated.reviews[churchUpdated.reviews.length - 1]);
    }
  });

};

module.exports.reviewsAddOne = function(req, res) {

  var id = req.params.churchId;

  console.log('POST review to churchId', id);

  Church
    .findById(id)
    .select('reviews')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding church");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("ChurchId not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Church ID not found " + id
        };
      }
      if (doc) {
        _addReview(req, res, doc);
      } else {
        res
          .status(response.status)
          .json(response.message);
      }
    });


};


module.exports.reviewsUpdateOne = function(req, res) {
  var churchId = req.params.churchId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for churchId ' + churchId);

  Church
    .findById(churchId)
    .select('reviews')
    .exec(function(err, church) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding church");
        response.status = 500;
        response.message = err;
      } else if(!church) {
        console.log("Church id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Church ID not found " + id
        };
      } else {
        // Get the review
        thisReview = church.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;
        church.save(function(err, churchUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};
