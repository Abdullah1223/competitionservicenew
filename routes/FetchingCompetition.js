const express = require('express');
const FetchingCompetition = require('../controllers/SearchingFetchingCompetition/FetchingCompetition');

const routeforfetchingcompetition = express.Router()

routeforfetchingcompetition.get('/',FetchingCompetition)



module.exports = routeforfetchingcompetition;