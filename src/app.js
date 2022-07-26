require('dotenv').config()
const express=require("express")
const hbs=require("hbs")
const path=require("path")
const app=express()

const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
// const cookieParser=require("cookie-parser")

require("./db/connectionDB")
const Register=require("./models/registers")
const { json }=require("express")
const { log }=require("console")
// const jwt=require("jsonwebtoken")



const port=process.env.PORT || 3000

const dirPath=path.join(__dirname,"../public")
const templatePath=path.join(__dirname,"../templates/views")
const partialsPath=path.join(__dirname,"../templates/partials")
// console.log(templatePath)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// app.use(cookieParser)

// app.use(express.json)
app.use(express.static(dirPath))
app.set("view engine","hbs")
app.set("views",templatePath)
hbs.registerPartials(partialsPath)

// console.log(process.env.SECRET_KEY)
// app.set("views",templatePath)
// console.log(process.env.SECRET_KEY)
app.get("/",(req,res)=>{
    // res.send("hello from server")
    res.render("index")
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/register",async(req,res)=>{
    try{
        // console.log(req.body.firstname)
        // console.log(req.body.lastname)
        // console.log(req.body.email)
        // console.log(req.body.age)
        // console.log(req.body.gender)
        // console.log(req.body.password)
        // console.log(req.body.confirmpassword)
        // res.send(req.body.firstname)
        const password=req.body.password
        const confirmpassword=req.body.confirmpassword
        if(password===confirmpassword){
          //  console.log("password match")
            const registerEmployee=new Register({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword
            })
            console.log("the success part"+registerEmployee)


            // pre part bcrypt  


            const token=await registerEmployee.generateAuthToken()
            console.log("the token part"+ token)
//cookie(name,value,option)
            // res.cookie("jwt",token,{
            //     expires:new Date(Date.now()+50000),
            //     httpOnly:true
            // })
            // console.log(cookie)

           const registered=await registerEmployee.save()
           console.log("the page part "+ registered)
           res.status(201).render("index")

        }else{
            res.send("password are not matching")
        }

    }catch(error){
        res.status(400).send(error)
    }
})

//login validation

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
       
      const userEmail =await Register.findOne({email:email})
      const isMatch=await bcrypt.compare(password,userEmail.password)
      const token=await userEmail.generateAuthToken()
            console.log("the token part "+ token)
            // res.cookie("jwt",token,{
            //     expires:new Date(Date.now()+30000),
            //     httpOnly:true
            // })
            // console.log(`this is cookies =${req.cookies.jwt}`)

      if(isMatch){
        res.status(201).render("index")
        // res.status(201).json(userEmail)
      }else{
        res.send("invalid details password or email are wrong")
      }
    //   res.send(userEmail)
    //   console.log(userEmail)

    }catch(error){
        res.status(400).send("invalid details")
    }
})
// const jwt=require("jsonwebtoken")
// const createToken=async ()=>{
//    const token=await jwt.sign({_id:"62d7970829c979aa4dbb7392"},"secretekeyshouldbeatleast32charaterslongotherwiseitwillshiwwrong")
//     console.log(token)
//     const userverify=jwt.verify(token,"secretekeyshouldbeatleast32charaterslongotherwiseitwillshiwwrong")
//     console.log(userverify)
// }
// createToken()


app.listen(port,()=>{
    console.log(`server is up on port ${port}`)
})