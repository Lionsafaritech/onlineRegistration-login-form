const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/userRegistration-signin",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
}).then(()=>{
    console.log("connection successful")
}).catch((error)=>{
    console.log("connection failed  :"+error)
})