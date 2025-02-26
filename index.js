// const express = require('express')
// const os  = require('node:os').availableParallelism()
// const cluster = require('node:cluster')
// const cors = require('cors')
// const dotenv = require('dotenv')
// const cookieparser = require('cookie-parser')
// const conn = require('./Connection')
// const routeforcompetitioncreation = require('./routes/CompetitionCreation')
// const routeforfetchingcompetition = require('./routes/FetchingCompetition')
// const routeforfetchingallcompetitions = require('./routes/FetchingAllCompetitions')
// const routeforcategoryfetching = require('./routes/CategoryFetching')
// const routeforsearchingcompetition = require('./routes/SearchingCompetition')
// const JwtAuth = require('./Middlewares/JwtAuth')
// const morgan = require('morgan')
// const { connection } = require('./KafkaConnection/KafkaConnection')
// const compression = require('compression')
// const routeforbrowseallcompetition = require('./routes/BrowseAllCompetition')
// const routeforviewallcompetitions = require('./routes/ViewAllCompetitions')
// const routeforfetchingcompetitionsforhome = require('./routes/FetchingCompetitionsForHome')
// const routeforspecificcompetition = require('./routes/FetchingSpecificCompetiton')
// const routeforimageurl = require('./routes/ImageUrl')

// dotenv.config()

// if(cluster.isPrimary){
//   for(i=0;os>i;i++){
//     cluster.fork()
//   }
// }else{
//    const app = express()

//    conn(process.env.MONGODBURI)

//    app.use(morgan('dev'))
//    app.use(express.json())
//    app.use(cors(
//     {
//       origin: `${process.env.ORIGINURL}`, // Frontend origin
//         credentials: true,
//     }
//    ))
//   //  app.use(cors(
//   //   {
//   //       origin: 'http://localhost:5173', // Frontend origin
//   //       credentials: true,
//   //   }
//   //  ))
//    app.use(compression())
//    app.use(cookieparser())
//     connection()
//     app.use('/HomeCompetitions',JwtAuth,routeforfetchingcompetitionsforhome)
//     app.use('/FetchingSpecificCompetition',JwtAuth,routeforspecificcompetition)
//   app.use('/BrowseAllCompetitions',JwtAuth,routeforbrowseallcompetition)
//   app.use('/ViewAllCompetitions',JwtAuth,routeforviewallcompetitions)
//    app.use('/competitioncreation',JwtAuth,routeforcompetitioncreation)
//    app.use('/fetchingcompetition',routeforfetchingcompetition)
//    app.use('/fetchingallcompetitions',routeforfetchingallcompetitions)
//    app.use('/fetchingcategorycompetitions',routeforcategoryfetching)
//    app.use('/searchingcompetitions',routeforsearchingcompetition)
//    app.use('/Imageurl',JwtAuth,routeforimageurl)
  
//    app.listen(process.env.PORT,()=>{console.log('Competition Service is Running on ' + process.env.PORT)})
// }


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
const fs = require('fs')
const https = require('https')
const http = require('http')

dotenv.config()
const PORT = process.env.PORT || '8001'

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

    const privateKey = fs.readFileSync('/etc/ssl/mycert/private-key.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/ssl/mycert/certificate.pem', 'utf8');
 // const ca = fs.readFileSync('/path/to/ca.pem', 'utf8'); // For some certificates, this might be required.
  const passphrase = '123456';
  const credentials = { key: privateKey, cert: certificate,passphrase: passphrase };

   https.createServer(credentials, app).listen(PORT, () => {
     console.log('HTTPS Competition Service is running on ' + PORT)
   })
}

// http.createServer((req, res) => {
//   res.writeHead(301, { Location: `https://${req.headers.host}:${PORT}${req.url}` })
//   res.end()
// }).listen(80, () => {
//   console.log('HTTP server is redirecting to HTTPS on port 80')
// })
