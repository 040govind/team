const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const emailValidator = require('deep-email-validator');
const nodemailer = require('nodemailer');
const randomString = require("randomstring");
const config = require('../confic/config');
const session = require('express-session');
//user_route.use(express.static(path.join(__dirname, 'public')));
//PASWORD ENCRYPTION DECRYPTION

const securePassword = async (password) => {

    try {
        const passHash = await bcrypt.hash(password, 10);
        return passHash;
    }
    catch (err) {
        console.log(err.message);
    }
}

//EMAIL VALIDATOR 
async function isEmailValid(email) {
    return emailValidator.validate(email);
}

//FOR SENDING MAIL

const sendVerifyMail = async (name, email, user_id) => {
    try {

        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let mailDetails = {
            from: 'dangig976@gmail.com',
            to: email,
            subject: 'Vrification mail',
            html: '<p>HII ' + name + ',please verify your account <a href="http://localhost:5000/verify?id=' + user_id + '">Verify </a> your mail</p>'
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully' + info.res);
            }
        });

    } catch (error) {

    }
}


//LOAD HOME PAGE******************************************************
const LoadHome = async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.log(error.message);
    }
}

// LOAD REGISTER FORM

const loadRegister = async (req, res) => {
    try {
        res.render('register');
    }
    catch (error) {
        console.log(error.message);
    }
}

//INSERT USER INTO THE DATA BASE 

const insertUser = async (req, res) => {
    try {
        //HASH PASSWORD GENERATION
        const email = req.body.email;
        const HashPass = await securePassword(req.body.password);
        const { valid, reason, validators } = await isEmailValid(email);



        //CHECK USER ALREADY EXIST OR NOT 

        const result = await User.find({ email });
        console.log(validators.smtp);
        if (valid) {

            res.render('register', { message: "please enter valid email" });
        }
        else if (result.length > 0) {
            console.log(result);
            sendVerifyMail(req.body.name, req.body.email, result[0]._id);
            res.render('register', { message: "Email already register but Not Verify please verify" });
        }
        else {
            const user = new User({
                name: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                password: HashPass,
                isVerify: 0
            });
            const userData = await user.save();
            if (userData) {
                sendVerifyMail(req.body.name, req.body.email, userData._id);

                res.render('register', { message: "Your Registration have been success" });
            }
            else {
                res.render('register', { message: "Your Registration have been Fail" });
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

//LOGIN METHOD START HERE ******************************************************
const loginLoad = async (req, res) => {
    try {

        res.render('login');
    } catch (error) {
        console.log(error.meassage);
    }
}

//verify login start
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userdata = await User.findOne({ email: email });
        //console.log(userdata);
        if (userdata) {
            //console.log(userdata.password);
            //console.log(password);
            const passwordMatch = await bcrypt.compareSync(password, userdata.password);
            //console.log(passwordMatch);
            if (passwordMatch) {
                console.log(userdata.isVerify);
                if (userdata.isVerify == false) {
                    console.log("verify");
                    res.render('login', { message: "Please verify your mail" });
                }
                else {
                    req.session.user_id = userdata._id;
                    console.log("Home")
                    res.render('index');
                }
            }
            else {
                res.render('login', { message: "Email and password are incorrect2" });
            }
        }
        else {
            res.render('login', { message: "Email and password are incorrect" });
        }


    } catch (error) {

    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

//FOR VERIFYING SEND MAIL

const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { isVerify: 1 } });
        console.log(updateInfo);
        res.render("verifyMail");
    } catch (error) {
        console.log(error.message);
    }
}

//FORGET LOAD ************ FORGET PASSWORD CODE START*********************

//*********FORGET PASSWORD EMAIL SEND FUNCTION START ********************************** */
const sendForgetMail = async (name, email, token) => {
    try {

        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let mailDetails = {
            from: config.mailUser,
            to: email,
            subject: 'For Reset Password Link',
            html: '<p>HII ' + name + ',please CLick here to  <a href="http://localhost:5000/forget-password?token=' + token + '">Reset your Password </a> </p>'
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully' + info.res);
            }
        });

    } catch (error) {

    }
}
//***********************EMSAAIL FUNCTION END******************************* */
const forgetLoad = async (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const userdata = await User.findOne({ email: email });
        if (userdata) {
            const randomstring = randomString.generate();

            if (userdata.isVerify === 0) {
                res.render('forget', { mesage: "Please verify your mail>" });
            }
            else {
             const updatedata = await User.updateOne({email:email},{$set:{token:randomstring}})
             sendForgetMail(userdata.name,email,randomstring);
             res.render('forget', { message: "Please check your mail to reset your password" });
            }
        }
        else {
            res.render('forget', { message: "Incorrect email" });
        }
    } catch (error) {
        console.log(error);
    }
}

const forgetPasswordLoad = async(req,res)=>{
    try {
        const token = req.query.token;
        const tokendata= await User.findOne({token:token});

        if(tokendata){
          res.render('forget-password',{user_id:tokendata._id});
        }
        else{
           res.render('404',{message:"Token is invalid"}); 
        }

    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async(req,res)=>{
    try {
        const  password=req.body.password;
        const userid= req.body.user_id;

        const secure_pass = await securePassword(password);
        const userdata = await User.findByIdAndUpdate({_id:userid},{$set:{passwor:secure_pass,token:''}});
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    LoadHome,
    verifyMail,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword
}