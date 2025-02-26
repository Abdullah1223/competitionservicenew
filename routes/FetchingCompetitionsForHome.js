const express = require('express');
const FetchingCompetitionsForHome = require('../controllers/FetchingCompetitionsForHome');


const routeforfetchingcompetitionsforhome = express.Router()


routeforfetchingcompetitionsforhome.get('/',FetchingCompetitionsForHome)


module.exports  = routeforfetchingcompetitionsforhome;