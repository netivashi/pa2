const express  = require("express");
const multer   = require("multer"); 
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app=express();
const {body,validationResult}=require("express-validator");
app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/A2_db",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("sucessfully connected");
}).catch((err)=>{
    console.log("error in connetion");
    process.exit();
});

const UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    avtar:String,
    gallery:[String]
});

const User= mongoose.model("User",UserSchema);

const options= multer.diskStorage({
    destination:"./public/uploads/",
    filename:function(req,file,callback){
        callback(null,file.fieldname + '-' + Date.now() + file.originalname);
    },
});

const upload= multer({storage:options});

app.get("/register",(req,res)=>{
    res.sendFile(__dirname+ "/views/reg.html");
});

app.post("/register",
    upload.fields([
        {name:'avatar',maxCount:1},
        {name:'gallery',maxCount:3}
    ]),
    [
        body('name').trim().isLength({min:2}).escape().withMessage("Enter Proper Name"),
        body('email').isEmail().normalizeEmail(),
        body('password').trim().isLength({min:5}).escape().withMessage("Enter Proper pwd"),
    ],

    async(req,res)=>{
        const errors=validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {name,email,password}=req.body;
        const avatar=req.files['avatar']?req.files['avatar'][0].filename:null;
        const gallery = req.files['gallery'] ? req.files['gallery'].map((file) => file.filename) : [];
    
        const newUser = new User({name,email,password,avatar,gallery});

        try{
            await newUser.save();
            res.json({message:"new user registered sucessfully"});
        }
        catch(err)
        {
            res.send("Erorr occur");
        }
    }
);


app.listen(3000);





