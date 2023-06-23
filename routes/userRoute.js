const express=require('express');
const multer = require('multer');
const user_route = express();
const bodyParser=require('body-parser');
const path = require('path');
const session = require('express-session');
const config = require('../confic/config');
const auth = require('../middleware/auth');
const upload = require('../middleware/addmissionMulter');
user_route.use(express.static( 'public'))
user_route.set('view engine','ejs');
user_route.set('views','./views/users');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.use(express.static(path.join(__dirname, 'public')));
user_route.use(express.static('public/css'));
user_route.use(session({
    resave:true,
    saveUninitialized:true,
    secret:config.sessionSecret}));

//REQUIRE THE USER CONTROLLER
const userController = require('../controllers/userController');
const admin =require('../controllers/adminController');
user_route.get('/',async (req,res)=>{
    const news =  await admin.displayNews(req,res);
    res.render('index',{msg:news});
})
//USER ROUTING REGESTRING FORM

user_route.get('/register',auth.isLogout,userController.loadRegister);
 user_route.post('/register',userController.insertUser);

 //USERlOGIN ROUTES 
 user_route.get('/login',auth.isLogout,userController.loginLoad);
 user_route.post('/login',userController.verifyLogin);


 //home page
 user_route.get('/',auth.isLogin,userController.LoadHome);
module.exports = user_route;

//VERIFY MAIL
user_route.get('/verify',userController.verifyMail);
user_route.get('/logout',auth.isLogin,userController.userLogout);

//FORGET PASSWORD
user_route.get('/forget',auth.isLogout,userController.forgetLoad);
user_route.post('/forget',userController.forgetVerify);
user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad);
user_route.post('/forget-password',userController. resetPassword);

//addmission form render 



user_route.get('/Admission',userController.loadAddmission);
//user_route.post('/admission',userController.submitAdmission);
