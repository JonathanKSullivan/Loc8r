var express = require('express')
var router = express.Router()

const ctrlLocation = require('../controllers/locations')
const ctrlOthers = require('../controllers/others')

/* GET home page. */
router.get('/', ctrlLocation.homelist)
router.get('/location', ctrlLocation.locationInfo)
router.get('/location/review/new', ctrlLocation.addReview)

/* Other pages */
router.get('/about', ctrlOthers.about)

module.exports = router
