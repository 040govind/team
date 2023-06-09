const User = require('../models/userModel');
const UserAdmission = require('../models/admissionModel');
const bcrypt = require('bcrypt');
const emailValidator = require('deep-email-validator');
const nodemailer = require('nodemailer');
const randomString = require("randomstring");
const config = require('../confic/config');
const session = require('express-session');
const multer = require('multer');
const mongoose=require('mongoose');
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

                res.render('register', { message: "Your Registration have been success  please verify your mail" });
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
const adminId = "adminnitt2024@gmail.com";
const adminPassword = "nitt@2024";
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email);
        console.log(password);
        if (email == adminId && password == adminPassword) {
            res.render('admin');
        }
        else {
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
                        sendVerifyMail(req.body.name, req.body.email, userdata._id);
                        res.render('login', { message: "Please verify your mail" });
                    }
                    else {
                        req.session.user_id = userdata._id;
                        console.log("Home")
                        res.render('index',{message:userdata.name});
                    }
                }
                else {
                    res.render('login', { message: "Email and password are incorrect2" });
                }
            }
            else {
                res.render('login', { message: "Email and password are incorrect" });
            }

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
                const updatedata = await User.updateOne({ email: email }, { $set: { token: randomstring } })
                sendForgetMail(userdata.name, email, randomstring);
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

const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokendata = await User.findOne({ token: token });

        if (tokendata) {
            res.render('forget-password', { user_id: tokendata._id });
        }
        else {
            res.render('404', { message: "Token is invalid" });
        }

    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const userid = req.body.user_id;

        const secure_pass = await securePassword(password);
        const userdata = await User.findByIdAndUpdate({ _id: userid }, { $set: { passwor: secure_pass, token: '' } });
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
};

//Admission page render
const loadAddmission = async (req, res) => {
    try {
        res.render('Admission');
    }
    catch (error) {
        console.log(error.message);
    }
};

//Post Admission form data
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function (req, file, cb) {
//         const extension = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + Date.now() + extension);
//     }
// });
// const upload = multer({ storage: storage });
// const submitAdmission = async (req, res) => {
//     try {
//         const email = req.body.email;
//         const result = await UserAdmission.find({ email });
//         console.log(req.body.city);

//         if (result.length > 0) {
//             res.render('/Admission', { message: "User Already register" });
//         }
//         else {
//            // const User = mongoose.model('User', userSchema);

            


//             const student = new UserAdmission({
//                 name: req.body.name,
//                 mobile: req.body.mobile,
//                 email: req.body.email,
//                 fatherName: req.body.fatherName,
//                 fatherOccupition: req.body.fatherOccupation,
//                 motherName: req.body.motherName,
//                 motherOccupition: req.body.motherOccupation,
//                 income: req.body.income,
//                 Caddress: {
//                     city: req.body.city,
//                     state: req.body.state,
//                     pin: req.body.pin,
//                 },
//                 Paddress: {
//                     city: req.body.city,
//                     state: req.body.state,
//                     pin: req.body.pin,
//                 },
//                 nationality: req.body.nationality,
//                 cast: req.body.caste,
//                 Detail10: {
//                     nameOfBoard: req.body.university10th,
//                     yearOfPassing: req.body.passingYear10th,
//                     Percentage: req.body.cgpa10th,
//                 },
//                 Detail12: {
//                     qualification: req.body.Qualification12th,
//                     nameOfBoard: req.body.university12th,
//                     yearOfPassing: req.body.passingYear12th,
//                     Percentage: req.body.cgpa12th,
//                 },
//                 jobTitle: req.body.jobTitle,
//                 jobExprience: req.body.jobExperience,
//                 userImg: req.files['userImg'][0].filename ,
//                 marksheet10:req.files['marksheet10'][0].filename,
//                 marksheet12:req.files['marksheet12'][0].filename,
//                 ugCertificate:req.files['ugCertificate'][0].filename,
//                 pgCertificate:req.files['pgCertificate'][0].filename,
//                 signature:req.files['signature'][0].filename,
//                 isVerify: 0
//             });

//             const studentData = await student.save();

//             if (studentData) {
//                 res.render('/documentUpload');
//             }
//             else {
//                 res.render('/Admission', { message: "Registration failed" });
//             }
//         }

//     } catch (error) {
//         console.log("in upload section");
//         console.log(error.message);
//     }
// }


const submitAdmission = async (req, res) => {
    try {
        const email = req.body.email;
        const result = await UserAdmission.find({ email });
        console.log(req.body.city);

        if (result.length > 0) {
            res.render('/Admission', { message: "User Already register" });
        }
        else {

            const student = new UserAdmission({
                name: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                fatherName: req.body.fatherName,
                fatherOccupition: req.body.fatherOccupation,
                motherName: req.body.motherName,
                motherOccupition: req.body.motherOccupation,
                income: req.body.income,
                Caddress: {
                    city: req.body.city,
                    state: req.body.state,
                    pin: req.body.pin,
                },
                Paddress: {
                    city: req.body.city,
                    state: req.body.state,
                    pin: req.body.pin,
                },
                nationality: req.body.nationality,
                cast: req.body.cast,
                Detail10: {
                    nameOfBoard: req.body.university10th,
                    yearOfPassing: req.body.passingYear10th,
                    Percentage: req.body.cgpa10th,
                },
                Detail12: {
                    qualification: req.body.Qualification12th,
                    nameOfBoard: req.body.university12th,
                    yearOfPassing: req.body.passingYear12th,
                    Percentage: req.body.cgpa12th,
                },
                jobTitle: req.body.jobTitle,
                jobExprience: req.body.jobExperience,
                isVerify: 0
            });

            const studentData = await student.save();

            if(studentData)
            {
                res.render('/documentUpload');
            }
            else{
                res.render('/Admission',{message:"Registration failed"});
            }
        }

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
    resetPassword,
    loadAddmission,
    submitAdmission
}