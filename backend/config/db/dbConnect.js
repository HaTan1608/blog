const mongoose = require('mongoose');

const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
          
            useUnifiedTopology:true,
            useNewUrlParser:true,
        });
        console.log('Data connected')
    }catch(error){
        console.log(error.message)
    }
}

module.exports=dbConnect;