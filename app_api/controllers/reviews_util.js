const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const doSetAverageRating = (location) => {
  if(!location.reviews && location.reviews.length > 0) {
    const averageRating = Math.round(location.reviews.reduce((review1, review2) => {
      review1.rating + review2.rating
    }, 0) / location.reviews.length);
    location.rating = averageRating;

    location.save(err =>{
      if(err){
        console.log(err);
      } else {
        console.log(`Average rating updated to ${location.rating}`);
      }
    })
  }
};

const updateAverageRating = (locationId) => {
  Loc
    .findOne(locationId)
    .select('reviews rating')
    .exec((err, location) =>{
      if(err){
        res
          .status(404)
          .json(err);
      } else {
        doSetAverageRating(location)
      }
    });
};

//Exported functions
const doAddReview = (req, res, location) => {
  if (!location){
    res
      .status(404)
      .json({"message": "location not found"});
  } else {
    const {author, rating, reviewText} = req.body;
    location.reviews.push({
     author,
     rating,
     reviewText
    });

    location.save((err, location) =>{
      if(err) {
        res
          .status(400)
          .json(err);
      } else {
        updateAverageRating(location._id);
        let thisReview = location.reviews.slice(-1).pop();
        res
          .status(201)
          .json(thisReview)
        }
      });
  }
}

module.exports = {
  doAddReview
};