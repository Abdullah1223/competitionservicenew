const express = require('express');
const ViewAllCompetitions = require('../controllers/SearchingFetchingCompetition/ViewAllCompetitions');

const routeforviewallcompetitions = express.Router()


routeforviewallcompetitions.get('/:Categoryname/:cursorid/:pagenum',ViewAllCompetitions)

module.exports = routeforviewallcompetitions;