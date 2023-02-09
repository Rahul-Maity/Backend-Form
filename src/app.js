require('dotenv').config();
const bcrypt = require("bcryptjs");
// console.log("Jay shree ram");
const express = require("express");
const app = express();
const empCollection=require("../src/model/model");


const path = require("path");
const template_path = path.join(__dirname, '../template/views');
// console.log(template_path);
app.set('view engine', 'hbs');
app.set('views', template_path);

app.use(express.urlencoded({extended:false}));
require('./db/db');
const port = process.env.PORT||3000;
// app.get('/', (req, res) => {
//     res.send("Hello world");
// })
console.log(process.env.SECRET_KEY);
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/empdata',async (req, res) => {
    try {
    
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            const empData = new empCollection({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword,
            });

            console.log("the success part" + empData);
            const token = await empData.generateAuthToken();
            console.log("The token part " + token);

            const postData = await empData.save();
            // console.log("The page part " + postData);
            res.send(postData);
        }
        else {
            res.send("password not matched");
        }
    }
    catch (error) {
        console.log(error);
    }
});
app.post('/logindata', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.loginpassword;
        const getEmail = await empCollection.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, getEmail.password);
        const token = await getEmail.generateAuthToken();
        console.log("The token part is " + token);
        if (isMatch) {
            res.render('suc');
        } else {
            res.send("password are not matching");
     }
    } catch (error) {
        console.log(error);
    }
});
/*
const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    const passwordmatch = await bcrypt.compare("123", passwordHash);
    console.log(passwordmatch);
}
securePassword("thapa@123");*/
/*
 jwebtoken concepts->
const jwt = require("jsonwebtoken");
const createToken = async () => {
    const tokenData=await jwt.sign({ _id: "63e10df1e778dcd9f0eb507d" }, "rethdhbcgdyjjghnvchukjsuhfnchjd",{expiresIn:"2 seconds"});
    console.log(`The jwebtoken is ${tokenData}`);
    const userVar = await jwt.verify(tokenData, "rethdhbcgdyjjghnvchukjsuhfnchjd");
    console.log(userVar);

}
createToken();
*/

app.listen(port, () => {
    console.log(`Connect at port : ${port}`);
})
