
const isLogin = async(req,res,next)=>{
    try {
        
        if(req.session.user_id){
          res.render('/',{message:req.session.user_id});
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
            res.render('index',{message:req.session.user_id});
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    isLogin,
    isLogout
}