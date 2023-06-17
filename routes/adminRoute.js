const express=require('express');
const auth = require('../middleware/auth');
const admin_route = express();
const bodyParser=require('body-parser');
const path = require('path');
admin_route.use(express.static( 'public'))
admin_route.set('view engine','ejs');
admin_route.set('views','./views/users');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));
admin_route.use(express.static(path.join(__dirname, 'public')));
admin_route.use(express.static('public/css'));
//const admin_route = express();
const adminController = require("../controllers/adminController");
admin_route.get('/admin',auth.isAdmin,adminController.LoadAdmin);
admin_route.post("/adminNews", adminController.insertNews);
module.exports = admin_route;