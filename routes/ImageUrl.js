const express = require('express');
const ImageUrl = require('../controllers/CompetitionCreation/ImageUrl');

const routeforimageurl = express.Router()

routeforimageurl.post('/',ImageUrl)


module.exports = routeforimageurl;