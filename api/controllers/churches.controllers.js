var mongoose = require('mongoose');
var Church = mongoose.model('Church');


var runGeoQuery = function(req, res) {

  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  if (isNaN(lng) || isNaN(lat)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, lng and lat must both be numbers"
      });
    return;
  }

  // A geoJSON point
  var point = {
    type : "Point",
    coordinates : [lng, lat]
  };

  var geoOptions = {
    spherical : true,
    maxDistance : 2000,
    num : 5
  };

  Church
    .geoNear(point, geoOptions, function(err, results, stats) {
      console.log('Geo Results', results);
      console.log('Geo stats', stats);
      if (err) {
        console.log("Error finding churches");
        res
          .status(500)
          .json(err);
      } else {
        res
          .status(200)
          .json(results);
      }
    });
};

module.exports.churchesGetAll = function(req, res) {
  console.log('Requested by: ' + req.user);
  console.log('GET the churches');
  console.log(req.query);

  var offset = 0;
  var count = 5;
  var maxCount = 50;

  if (req.query && req.query.lat && req.query.lng) {
    runGeoQuery(req, res);
    return;
  }

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, count and offset must both be numbers"
      });
    return;
  }

  if (count > maxCount) {
    res
      .status(400)
      .json({
        "message" : "Count limit of " + maxCount + " exceeded"
      });
    return;
  }

  Church
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, churches) {
      console.log(err);
      console.log(churches);
      if (err) {
        console.log("Error finding churches");
        res
          .status(500)
          .json(err);
      } else {
        console.log("Found churches", churches.length);
        res
          .json(churches);
      }
    });

};

module.exports.churchesGetOne = function(req, res) {
  var id = req.params.churchId;

  console.log('GET churchId', id);

  Church
    .findById(id)
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
      res
        .status(response.status)
        .json(response.message);
    });

};

var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};

module.exports.churchesAddOne = function(req, res) {
  console.log("POST new church");

  Church
    .create({
      name : req.body.name,
      description : req.body.description,
      stars : parseInt(req.body.stars,10),
      services : _splitArray(req.body.services),
      photos : _splitArray(req.body.photos),
      currency : req.body.currency,
      location : {
        address : req.body.address,
        coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      }
    }, function(err, church) {
      if (err) {
        console.log("Error creating church");
        res
          .status(400)
          .json(err);
      } else {
        console.log("Church created!", church);
        res
          .status(201)
          .json(church);
      }
    });

};


module.exports.churchesUpdateOne = function(req, res) {
  var churchId = req.params.churchId;

  console.log('GET churchId', churchId);

  Church
    .findById(churchId)
    .select('-reviews -rooms')
    .exec(function(err, church) {
      if (err) {
        console.log("Error finding church");
        res
          .status(500)
          .json(err);
          return;
      } else if(!church) {
        console.log("ChurchId not found in database", churchId);
        res
          .status(404)
          .lson({
            "message" : "Church ID not found " + churchId
          });
          return;
      }

      church.name = req.body.name;
      church.description = req.body.description;
      church.stars = parseInt(req.body.stars,10);
      church.services = _splitArray(req.body.services);
      church.photos = _splitArray(req.body.photos);
      church.currency = req.body.currency;
      church.location = {
        address : req.body.address,
        coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      };

      hotel
        .save(function(err, churchUpdated) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });


    });

};