const express = require('express');
const FetchingAllCompetitions = require('../controllers/SearchingFetchingCompetition/FetchingAllCompetitions');

const routeforfetchingallcompetitions = express.Router()
routeforfetchingallcompetitions.get('/:genre/:page',FetchingAllCompetitions)

module.exports = routeforfetchingallcompetitions;