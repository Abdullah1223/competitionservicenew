const CompetitionManager = require('../../models/CompetitionSchema')
const RedisManager = require('../../RedisConnection/RedisConnection')
const CategoryFetching = async(req,res)=>{
    const category = req.params.category.toLowerCase();  
  try{
    const CheckingForCache = await RedisManager.exists(`${category}`+"competition")
    if(CheckingForCache){
        const FindingData =await RedisManager.lrange(`${category}`+"competition",0,-1)
        const Parsed = FindingData.map(items => JSON.parse(items))
        return res.status(200).send(Parsed)
    }else{
        const data = await CompetitionManager.find({genre:category})
        .select('title description image createdby startdate deadline prize ientryfees entryFee genre status')
        .sort({createdate:-1})
        .limit(20)
        //const ParsedData = data.map(items=>JSON.stringify(items));
      
     if(data.length==0){
            return res.status(404).send({message:'Nothing Found'})
     }
        const RedisDataSetName= `${category}`+"competition"
        await RedisManager.lpush(RedisDataSetName,...data.map(items=>JSON.stringify(items)))
        await RedisManager.expire(RedisDataSetName,1800)
        return res.status(200).send(data)
    
    }
  }catch(err){
    console.log(err)
  }
}
module.exports = CategoryFetching;