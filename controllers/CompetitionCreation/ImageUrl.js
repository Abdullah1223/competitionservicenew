const CompetitionManager = require("../../models/CompetitionSchema");
const { getObjectUrl } = require("../AwsConnection/AwsS3Client");

const ImageUrl = async(req,res)=>{
 
    console.log(req.body)
    const {filename,competition_id}=req.body;
    const gettingUrl = await getObjectUrl(`Uploads/User_Uploads/CompetitionImages/${filename}`)
   console.log(gettingUrl)

    const  updatingDatabase = await CompetitionManager.findOneAndUpdate({_id:competition_id},{
        $set:{
            'image':gettingUrl
        }
    })


   return res.status(200).send({Message:'dasdas'})

}

module.exports = ImageUrl;