const mongoose = require('mongoose')
const Loc = mongoose.model('Location')

const locUtil = require('./locations_util')

const locationsCreate = (req, res) => {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities:
      req.body.facilities.split(','),
    coords: {
      type: 'Point',
      coordinates: [
        parseFloat(req.body.lng),
        parseFloat(req.body.lat)
      ]
    },
    openingTimes: locUtil.setOpeningTimes(
      req.body.days.split(','),
      req.body.openings.split(','),
      req.body.closings.split(','),
      req.body.closeds.split(',')
    )
  }, (err, location) => {
    if (err) {
      res
        .status(404)
        .json(err)
    } else {
      res
        .status(201)
        .json(location)
    }
  })
}

const locationsReadOne = (req, res) => {
  Loc.findById(req.params.locationid)
    .select('name reviews')
    .exec((err, location) => {
      if (!location) {
        return res
          .status(404)
          .json({
            message: 'location not found'
          })
      } else if (err) {
        return res
          .status(404)
          .json(err)
      } else {
        return res
          .status(201)
          .json(location)
      }
    })
}

const locationsListByDistance = async (req, res) => {
  const lng = parseFloat(req.query.lng)
  const lat = parseFloat(req.query.lat)
  const near = {
    type: 'Point',
    coordinates: [lng, lat]
  }
  const geoOptions = {
    distanceField: 'distance.calculated',
    key: 'coords',
    spherical: true,
    maxDistance: 20000,
    
  }
  if (req.query.maxDistance == undefined) {
    geoOptions.maxDistance = req.query.maxDistance
  }
  if (!lng || !lat) {
    return res
      .status(404)
      .json({
        message: 'lng and lat query parameters are required'
      })
  }
  try {

    const results = await Loc.aggregate([
      {
        $geoNear: {
          near,
          ...geoOptions
        }
      }
    ])
    const locations = locUtil.buildListOfLocations(results)

    return res
      .status(200)
      .json(locations)
  } catch (err) {
    return res
      .status(404)
      .json(err)
  }
}
const locationsUpdateOne = (req, res) => {
  if(!req.params.locationid){
    return res
      .status(404)
      .json({
        "message": "Not found, locationid is required"
      });
  }
  Loc
    .findByID(req.params.locationid)
    .select('-reviews -ratings')
    .exec((err, location) => {
      if(!location){
        return res
          .status(404)
          .json({
            "message": "locationid not found"
          });
      } else if(err) {
        return res
          .status(400)
          .json(err);
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(',');
      location.coord = {
        type: "Point",
        coordinates: [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat)
        ]
      };
      location.openingTimes = locUtil.setOpeningTimes(
        req.body.days.split(','),
        req.body.openings.split(','),
        req.body.closings.split(','),
        req.body.closeds.split(',')
      )
      location.save((err, loc) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(200)
            .json(loc);
        }
      });
  });
}

const locationsDeleteOne = (req, res) => {
  const locationid = req.params.locationid;
  if (locationid){
    Loc
      .findByIDAndRemove(locationid)
      .exec((err, location) => {
        if (err) {
          return res
            .status(404)
            .json(err);
        } else {
          return res
            .status(204)
            .json(null);
        }
      });
  } else {
    res
      .status(404)
      .json({
        "message": "No Location"
      })
  }
}

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
}
