const mongoose = require('mongoose')

const conn = async(uri)=>{
    await mongoose.connect(uri,{
    maxPoolSize: 100,
    }).then(()=>{console.log('MongoDb is Connected')})
} 
module.exports = conn;