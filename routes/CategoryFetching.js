const express = require('express');
const CategoryFetching = require('../controllers/SearchingFetchingCompetition/CategoryFetching');
const routeforcategoryfetching = express.Router()

routeforcategoryfetching.get('/:category',CategoryFetching)


module.exports=routeforcategoryfetching;