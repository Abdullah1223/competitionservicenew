const express = require('express');
const BrowseAllCompetitions = require('../controllers/BrowseAllCompetitions');

const routeforbrowseallcompetition = express.Router()

routeforbrowseallcompetition.get('/:cursor/:totalCursorSaves/:pagenum',BrowseAllCompetitions)

module.exports = routeforbrowseallcompetition;