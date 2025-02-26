const express = require('express')
const os  = require('node:os').availableParallelism()
const cluster = require('node:cluster')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieparser = require('cookie-parser')
const conn = require('./Connection')
const routeforcompetitioncreation = require('./routes/CompetitionCreation')
const routeforfetchingcompetition = require('./routes/FetchingCompetition')
const routeforfetchingallcompetitions = require('./routes/FetchingAllCompetitions')
const routeforcategoryfetching = require('./routes/CategoryFetching')
const routeforsearchingcompetition = require('./routes/SearchingCompetition')
const JwtAuth = require('./Middlewares/JwtAuth')
const morgan = require('morgan')
const { connection } = require('./KafkaConnection/KafkaConnection')
const compression = require('compression')
const routeforbrowseallcompetition = require('./routes/BrowseAllCompetition')
const routeforviewallcompetitions = require('./routes/ViewAllCompetitions')
const routeforfetchingcompetitionsforhome = require('./routes/FetchingCompetitionsForHome')
const routeforspecificcompetition = require('./routes/FetchingSpecificCompetiton')
const routeforimageurl = require('./routes/ImageUrl')

dotenv.config()

if(cluster.isPrimary){
  for(i=0;os>i;i++){
    cluster.fork()
  }
}else{
   const app = express()

   conn(process.env.MONGODBURI)

   app.use(morgan('dev'))
   app.use(express.json())
   app.use(cors(
    {
      origin: `${process.env.ORIGINURL}`, // Frontend origin
        credentials: true,
    }
   ))
  //  app.use(cors(
  //   {
  //       origin: 'http://localhost:5173', // Frontend origin
  //       credentials: true,
  //   }
  //  ))
   app.use(compression())
   app.use(cookieparser())
    connection()
    app.use('/HomeCompetitions',JwtAuth,routeforfetchingcompetitionsforhome)
    app.use('/FetchingSpecificCompetition',JwtAuth,routeforspecificcompetition)
  app.use('/BrowseAllCompetitions',JwtAuth,routeforbrowseallcompetition)
  app.use('/ViewAllCompetitions',JwtAuth,routeforviewallcompetitions)
   app.use('/competitioncreation',JwtAuth,routeforcompetitioncreation)
   app.use('/fetchingcompetition',routeforfetchingcompetition)
   app.use('/fetchingallcompetitions',routeforfetchingallcompetitions)
   app.use('/fetchingcategorycompetitions',routeforcategoryfetching)
   app.use('/searchingcompetitions',routeforsearchingcompetition)
   app.use('/Imageurl',JwtAuth,routeforimageurl)
  
   app.listen(process.env.PORT,()=>{console.log('Competition Service is Running on ' + process.env.PORT)})
}