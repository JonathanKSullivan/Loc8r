const mongoose = require('mongoose')
const Loc = mongoose.model('Location')

const locUtil = require('./locations_util')

const locationsCreate = (req, res) => {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities:
      req.body.facilities.split(','),
    coord: {
      type: 'Point',
      coordinates: [
        parseFloat(req.body.lng),
        parseFloat(req.body.lat)
      ]
    },
    openingTimes: locUtil.setOpeningTimes(
      req.body.days,
      req.body.openings,
      req.body.closings,
      req.body.closeds
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
  Loc.findByID(req.params.locationid)
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
    limit: 10
  }
  if (req.query.maxDistance !== undefined) {
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
    res
      .status(200)
      .json(locations)
  } catch (err) {
    res
      .status(404)
      .json(err)
  }
}
const locationsUpdateOne = (req, res) => {
  res
    .status(200)
    .json({ status: 'success' })
}
const locationsDeleteOne = (req, res) => {
  res
    .status(200)
    .json({ status: 'success' })
}

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
}
