const mongoose = require('mongoose');
const CompetitionManager = require('../../models/CompetitionSchema');
const {producer} = require('../../KafkaConnection/KafkaConnection')
const RedisManager =require('../../RedisConnection/RedisConnection')
const RedisPublisher = require('../../RedisConnection/RedisConnection');
const { getObjectUrlForUpload } = require('../AwsConnection/AwsS3Client');
const CompetitionCreation = async (req, res) => {
  const { name, description, image, lastdate, prizemoney, entryfees, category, ifentryfees, startdate,fileName,fileSize,fileType } = req.body;
  const { _id } = req.body.user;
  const randnum = Math.floor(Math.random()*1000)

  const filename =  `${fileName}:${randnum}`
   

  try {
    // Trim and normalize spaces in the name (i.e., convert multiple spaces to a single space)
    const checkcomp = name.trim().toLowerCase().replace(/\s+/g, ' ');

    // Create a regex to search for the competition title in the database, ignoring case
    const regex = new RegExp(`^${checkcomp}$`, 'i');  // Exact match, case insensitive

    // Search for existing competition with the same title
    const CheckingForComp = await CompetitionManager.find({ title: { $regex: regex } });
    console.log(CheckingForComp);

    if (CheckingForComp.length === 0) {
      console.log('comp block');
      
      // Add the job to the queue
      // const data = {
      //   name,
      //    description,
      //     image, 
      //     lastdate,
      //      prizemoney, entryfees, category, ifentryfees, startdate, _id,
      //      type:'Creation'
      // }

      const createdate = new Date();
      
       // const category = job.data.category.toLowercase()
       const CreatingCompetition = await CompetitionManager.create({
           title:name,
           
           description:description,
           image:filename,
           createdby:_id,
           createdate:createdate,
           startdate:startdate,
           deadline:lastdate,
           prize:prizemoney,
           ifentryfees:ifentryfees,
           entryFee:entryfees,
           genre:category,
           status:'upcoming'
       })

       const competition_id = CreatingCompetition._id.toString()
       const gettingSignedUrl = await getObjectUrlForUpload(`Uploads/User_Uploads/CompetitionImages/${filename}`,fileType)
       
       if(CreatingCompetition){
      const data = {
        CreatorId:_id,
        CompetitionName:name,
        StartDate:startdate,
        Deadline:lastdate,
      }
      await RedisPublisher.publish('Creation',JSON.stringify(data))
       await RedisManager.del('AllCompetitionData')
    }

     return  res.status(200).send({filename,competition_id,gettingSignedUrl});
      
 
    } else {
      console.log('error block');
      return res.status(400).send({ message: 'Name is already taken' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

module.exports = CompetitionCreation;

      //await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(data),partition:2}]})
