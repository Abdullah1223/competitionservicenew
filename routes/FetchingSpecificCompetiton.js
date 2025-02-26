const express = require('express');
const FetchingSpecificCompetition = require('../controllers/FetchingSpecificCompetition');


const routeforspecificcompetition = express.Router()

routeforspecificcompetition.get('/:competitionid',FetchingSpecificCompetition)


module.exports = routeforspecificcompetition;