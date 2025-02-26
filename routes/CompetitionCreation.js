const express = require('express');
const CompetitionCreation = require('../controllers/CompetitionCreation/CompetitionCreation');

const routeforcompetitioncreation = express.Router()

routeforcompetitioncreation.post('/',CompetitionCreation)

module.exports= routeforcompetitioncreation;