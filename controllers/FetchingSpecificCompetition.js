const CompetitionManager = require("../models/CompetitionSchema");
const UserManager = require("../models/UserSchema");
const RedisManager = require('../RedisConnection/RedisConnection')
const FetchingSpecificCompetition = async (req,res)=>{

 const CompetitionId = req.params.competitionid;
 const currentuserid = req.body.user._id

 try{
   const CheckingForSavedListCache  = await RedisManager.get(`${currentuserid}savedlist`)
   const RedisPipeline = RedisManager.pipeline()
   let Data=[]
   let SavedList;
   let competitionData;
   if(CheckingForSavedListCache!=null){
      const parsing = JSON.parse(CheckingForSavedListCache)
      SavedList=parsing 
   }else{
      const user = await UserManager.findOne({ _id: currentuserid }).select("saved._id").lean();
      RedisPipeline.set(`${currentuserid}savedlist`,JSON.stringify(user.saved) ,'EX',800)
      SavedList=user?.saved
   }
   
    const CheckingForCompetitionCache = await RedisManager.hget('SpecificCompetitionData',`${CompetitionId}:Data`)
    if(CheckingForCompetitionCache!=null){
     const parsing = JSON.parse(CheckingForCompetitionCache)
    // Data.push(parsing)
     competitionData=parsing; 
    await RedisPipeline.exec()
     return res.status(200).send({
      SavedList,
      competitionData
     })
    }
    const FetchingCompetitions = await CompetitionManager.findOne({_id:CompetitionId})
    .select('title description image startdate deadline entryFee prize genre createdby createdate').lean()
      if(FetchingCompetitions!=null){
      const CreatorId = FetchingCompetitions.createdby 
      const FetchingCreator = await UserManager.findOne({_id:CreatorId}).select('name').lean()
      const DataToSend= FetchingCreator==null?{...FetchingCompetitions}:{...FetchingCompetitions,createdby:FetchingCreator}
      competitionData=DataToSend
      RedisPipeline.hset('SpecificCompetitionData',`${CompetitionId}:Data`,JSON.stringify(DataToSend))
      RedisPipeline.expire('SpecificCompetitionData',1200)
      await RedisPipeline.exec()
      return res.status(200).send({
         SavedList,
         competitionData
      })  
      }
  
  return res.status(404).send({Message:'Not Found'})
 }catch(err){
   console.log(err)
   return res.status(500).send({Message:'Server Error'})
 }


}

module.exports = FetchingSpecificCompetition;
