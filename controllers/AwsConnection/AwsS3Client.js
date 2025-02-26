const {S3Client, GetObjectCommand, PutObjectCommand}=require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const s3Client = new S3Client({
    region:'us-east-2',
    credentials:{
        accessKeyId:'AKIATYHW6LTCOCKVYDWF',
        secretAccessKey:'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',
    }
})

const getObjectUrl = async(key)=>{

   const command = new GetObjectCommand({
    Bucket:'rankappfinal',
    Key:key
   })
   const url = await getSignedUrl(s3Client,command)
  return url;
}

const getObjectUrlForUpload = async(key,contentype)=>{
    const command = new  PutObjectCommand({
        Bucket:'rankappfinal',
        Key:key,
        ContentType:contentype
    })
    const url = await getSignedUrl(s3Client,command,{expiresIn:360})
   return url 
}
module.exports  = {getObjectUrl,getObjectUrlForUpload}