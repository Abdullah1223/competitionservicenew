const express= require('express')
const SearchingCompetitions = require('../controllers/SearchingFetchingCompetition/SearchingCompetitions')

const routeforsearchingcompetition = express.Router()
routeforsearchingcompetition.get('/:SearchQuery?',SearchingCompetitions) 




module.exports =routeforsearchingcompetition