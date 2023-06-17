const News = require('../models/adminModel');
const LoadAdmin = async(req,res)=>{
    try {
        res.render("admin");
    } catch (error) {
        console.log(error.message);
    }
}
const displayNews = async (req, res) => {
    try {
      console.log("aaaa");
      const result = await News.find({});
      console.log(result[0].content);
      if (result.length > 0) {
        const contents = result.map((item) => item.content);
        req.session.destroy();
        res.render("index", { msg: contents });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
const insertNews = async (req, res) => {
    try {
      const news = req.body.news;
  
      const result = await News.find({});
      console.log(result);
      if (result.length == 0) {
        const newNews = new News({
          content: req.body.news,
        });
        const newsData = await newNews.save();
        if (newsData) {
          displayNews(req, res);
          // res.render("admin", { message: "News added successfully" });
        }
      } else if (result.length > 0) {
        /* const newNews = new News({
                  content: req.body.news
              });*/
        // const updateNews = await News.findByIdAndUpdate({_id:userid},{$set:{passwor:secure_pass,token:''}});
        const updateNews = await News.updateOne(
          { content: result[0].content },
          { $set: { content: news } }
        );
        //const newsData = await newNews.save();
        if (updateNews) {
          displayNews(req, res);
          //res.render("admin", { message: "News added successfully" });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  module.exports = {
    insertNews,
    LoadAdmin
  };
  