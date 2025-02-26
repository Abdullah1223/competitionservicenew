const RedisManager = require('../../RedisConnection/RedisConnection')
const CompetitionManager = require('../../models/CompetitionSchema')
const FetchingCompetition = async(req,res)=>{

    try{
        const CachedLatestCompetitonExists = await RedisManager.exists('latestcompetitions')
        if(CachedLatestCompetitonExists){
          const CachedCompetitions = await RedisManager.get('latestcompetitions')
          return res.status(200).send(CachedCompetitions)
        }else{
          const upcomming = await CompetitionManager.aggregate([
            { 
                $match: { status: 'upcoming' }
            },
            { 
                $project: {
                    title: 1,
                    description: 1,
                    image: 1,
                    createdby: 1,
                    startdate: 1,
                    deadline: 1,
                    prize: 1,
                    ientryfees: 1,
                    entryFee: 1,
                    genre: 1,
                    status: 1,
                    participants: { $size: "$participants" } // Calculate the length of participants array
                }
            },
            { 
                $sort: { createdate: -1 }
            },
            { 
                $limit: 4 
            }
        ]);
        const started = await CompetitionManager.aggregate([
                    { 
              $match: { status: 'started' }
          },
          { 
              $project: {
                  title: 1,
                  description: 1,
                  image: 1,
                  createdby: 1,
                  startdate: 1,
                  deadline: 1,
                  prize: 1,
                  ientryfees: 1,
                  entryFee: 1,
                  genre: 1,
                  status: 1,
                  participants: { $size: "$participants" } // Calculate the length of participants array
              }
          },
          { 
              $sort: { createdate: -1 }
          },
          { 
              $limit: 4 
          }
      ]);
                 const data={
            upcomming:upcomming,
            started:started,
           }
           convertingtostring = JSON.stringify(data)
           await RedisManager.set('latestcompetitions',convertingtostring) 
           
         return res.status(200).send(data)
        }
    }catch(err){
        console.log(err)
    }
    
}

module.exports = FetchingCompetition;