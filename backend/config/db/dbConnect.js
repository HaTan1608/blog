const mongoose = require('mongoose');

const dbConnect = async () => {
    var url = "mongodb+srv://amazona:8365598a@cluster0.fdtaq.mongodb.net/fshop?authSource=admin&replicaSet=atlas-55bbid-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

    try{
        await mongoose.connect(url,{
          
            useUnifiedTopology:true,
            useNewUrlParser:true,
        });
        console.log('Data connected')
    }catch(error){
        console.log(error.message)
    }
}

module.exports=dbConnect;