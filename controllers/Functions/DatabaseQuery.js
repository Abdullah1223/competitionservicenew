const CompetitionManager = require("../../models/CompetitionSchema");

const DatabaseQueryForStatus = async (Value,skip,limit)=>{
 
    const AllCompData = await CompetitionManager.aggregate([
        {$match:{status:Value}},
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
      return AllCompData;

}


const DatabaseQueryForGenre = async(Value,skip,limit)=>{

    const AllCompData = await CompetitionManager.aggregate([
        {$match:{genre:Value}},
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
      return AllCompData;
}
module.exports = {DatabaseQueryForStatus,DatabaseQueryForGenre};