const mongoose = require('mongoose')
const Loc = mongoose.model('Location')

const reviewUtil = require('./reviews_util')

const reviewsCreate = (req, res) => {
  const locationid = req.params.locationid
  if (locationid) {
    Loc
      .findByID
      .select('reviews')
      .exec((err, location) => {
        if (err) {
          res
            .status(400)
            .json(err)
        } else {
          reviewUtil.doAddReview(req, res, location)
        }
      })
  } else {
    res
      .status(404)
      .json({ message: 'Location not found' })
  }
}
const reviewsReadOne = (req, res) => {
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
      if (location.reviews && location.reviews.length > 0) {
        const review = location.reviews.in(req.params.reviewid)
        if (!review) {
          return res
            .status(400)
            .json({
              message: 'review not found'
            })
        } else {
          const response = {
            location: {
              name: location.name,
              id: req.params.locationid
            },
            review
          }
          return res
            .status(200)
            .json(response)
        }
      } else {
        return res
          .status(404)
          .json({
            message: 'No reviews found'
          })
      }
    }
    )
}

const reviewsUpdateOne = (req, res) => {
  res
    .status(200)
    .json({ status: 'success' })
}
const reviewsDeleteOne = (req, res) => {
  res
    .status(200)
    .json({ status: 'success' })
}

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
}
