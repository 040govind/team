const User =require('../models/userModel');
const isLogin = async(req,res,next)=>{
    try {
        
        if(req.session.user_id){
            const data = await User.findOne({_id:req.session.user_id});

          res.render('/',{message:data.name});
        }
        else{
              res.redirect('/');
        }
        next();

    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
        

        if(req.session.user_id)
        {
            const data = await User.findOne({_id:req.session.user_id});

            res.render('index',{message:data.name});
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

//FOR ADMISSION PAGE RENDERING
const isLoginAdmission = async(req,res,next)=>{
    try {
        
        if(req.session.user_id){
            //const data = await User.findOne({_id:req.session.user_id});

          res.render('/Admission');
        }
        else{
              res.render('register',{message:"Please Register first"});
        }
        next();

    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    isLogin,
    isLogout,
    isLoginAdmission
}