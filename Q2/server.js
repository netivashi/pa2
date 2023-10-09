const express=require("express");
const session = require("express-session");
const app=express();
const path = require('path');
const FileStore = require('session-file-store')(session);

app.use(express.static("public"));
app.use(express.urlencoded({extended:false}));

app.use(session({
    secret: 'secretcode',
    resave: false,
    saveUninitialized: false,
    //store: new FileStore({ path: './session-data' })
}))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/public/login.html');
});

app.post("/login",(req,res)=>{
    var u=req.body.uname;
    var p=req.body.password;

    if(u!="" && p!="")
    {
        if(u=="neti@gmail.com" && p=="neti123")
        {
            req.session.username='neti@gmail.com';
            console.log(req.session.username);
            return res.redirect("/logincheck");
        }
        else
        {
            res.send("<script>alert('Invalid User!!')</script>");
        }
    }
    else
    {
        res.send("<script>alert('Fill Data!..')</script>");
    }
});

app.get("/logincheck",(req,res)=>{
    if(req.session.username)
    {
        res.send(req.session.username+ "is Logged!");
       // console.log(res.session.username ,req.session.username);
    }
});

app.listen(5000,()=>{
    console.log("App is running....");
})