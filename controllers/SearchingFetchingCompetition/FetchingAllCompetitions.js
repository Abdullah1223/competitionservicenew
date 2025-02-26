

const RedisManager = require('../../RedisConnection/RedisConnection');
const CompetitionManager = require('../../models/CompetitionSchema');
const {DatabaseQueryForStatus, DatabaseQueryForGenre} = require('../Functions/DatabaseQuery');
const FetchingAllCompetitions = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 0;
    const limit = 4;
    const skip = page * limit;
    const genre = req.params.genre.toLowerCase()
    console.log(genre)
    if(genre=='live'){
      const RedisCheck = await RedisManager.exists(`CompetitionDataLive:${page}`)
      if(RedisCheck){
      console.log('Fetching From Redis')

        const GettingRedisVal = await RedisManager.get(`CompetitionDataLive:${page}`)
        return res.status(200).send(GettingRedisVal)
      }
   const data=  await DatabaseQueryForStatus('started',skip,limit)
   if(data.length>0){
    console.log('SettingToRedis')
    const SettingToRedis = await RedisManager.set(`CompetitionDataLive:${page}`,JSON.stringify(data),'EX',1800)
    return res.status(200).send(data)
   }
   return res.status(200).send(data)    
   
  }else if(genre=='upcoming'){
    const RedisCheck = await RedisManager.exists(`CompetitionDataUpcoming:${page}`)
      if(RedisCheck){
      console.log('Fetching From Redis')
        const GettingRedisVal = await RedisManager.get(`CompetitionDataUpcoming:${page}`)
        return res.status(200).send(GettingRedisVal)
      }
   const data=  await DatabaseQueryForStatus('upcoming',skip,limit)
   if(data.length>0){
    console.log('SettingToRedis')
    const SettingToRedis = await RedisManager.set(`CompetitionDataUpcoming:${page}`,JSON.stringify(data),'EX',1800)
    return res.status(200).send(data)
   }
   return res.status(200).send(data)   
    }else if(genre=='all'){
      const CheckingForRedis = await RedisManager.exists(`CompetitionDataall:${page}`)
      if(CheckingForRedis){
        console.log('Fetching From Redis')
        const GettingFromRedis  = await RedisManager.get(`CompetitionDataall:${page}`)
        return res.status(200).send(GettingFromRedis)
      }

      const AllCompData = await CompetitionManager.aggregate([
          { $project: { 
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
          participants: { $size: '$participants' },
         } },
        { $sort: { createdate: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);

      if(AllCompData.length>0){
        console.log('SettingTorEDIS')
        const SettingToRedis = await RedisManager.set(`CompetitionDataall:${page}`,JSON.stringify(AllCompData),'EX',1800)
        return res.status(200).send(AllCompData)
      }
      return res.status(200).send(AllCompData)
    }else{
      const CheckingForRedis = await RedisManager.exists(`CompetitionData${genre}:${page}`)
      if(CheckingForRedis){
        console.log('Fetching From Redis')
        const GettingFromRedis =await RedisManager.get(`CompetitionData${genre}:${page}`)
        return res.status(200).send(GettingFromRedis)
      }
       const data = await DatabaseQueryForGenre(`${genre}`,skip,limit)  
       if(data.length>0){
        console.log('Setting To Redis')
        const SettingToRedis = await RedisManager.set(`CompetitionData${genre}:${page}`,JSON.stringify(data),'EX',1800)
        return res.status(200).send(data)
       } 
       return res.status(200).send(data)
    }
    
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = FetchingAllCompetitions;