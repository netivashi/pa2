const express = require("express");
const app = express();
const Student = require("./StudentModel");
const Register = require("./userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
    res.render("login");
})

router.post("/login", async (req, res) => {
    const LoginCheck = await Register.find({ username: req.body.username });
    console.log(LoginCheck);
    if (LoginCheck != "") {
        const token = jwt.sign({ username: req.body.username }, "secret", { expiresIn: '2h' });
        console.log(token);
        res.cookie('token', token, { httpOnly: true });
        res.redirect("/student");
    }
    else {
        res.redirect("/");
    }
})

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).render("login");
    }
    jwt.verify(token, "secret", (error, user) => {
        if (error) {
            res.render("login");
        }
        else {
            req.user = user;
            console.log(req.user);
            next();
        }
    })
}

router.get("/student", verifyToken, async (req, res) => {
    const result = await Student.find()

    if (result) {
        res.render('studentData', {
            StudentData: result,
        });
    }
})

router.get("/addStudent", verifyToken, async (req, res) => {
    res.render("insertData");
})

router.get("/logout", verifyToken, async (req, res) => {
    res.clearCookie('token');
    res.redirect("/");
})

router.post("/addStudent", verifyToken, async (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const city = req.body.city;

    const c = new Student({ name: name, age: age, city: city });

    const result = await c.save();

    if (result) {
        res.redirect('/student');
    }
})

router.post("/updateStudent/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const updateData = await Student.findByIdAndUpdate(id, {
        name: req.body.name,
        age: req.body.age,
        city: req.body.city,
    })
    res.redirect('/student');
})

router.get("/deleteStudent/:id", verifyToken, async (req, res) => {
    const _id = req.params.id;
    const result = await Student.findByIdAndDelete(_id);

    if (result) {
        res.redirect('/student');
    }
})

router.get("/editStudent/:id", verifyToken, async (req, res) => {
    const _id = req.params.id;
    const result = await Student.findById(_id);
    console.log(result);
    res.render('updateData', {
        upData: result
    });
})

module.exports = router;