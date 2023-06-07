const mongoose= require('mongoose');
mongoose.connect("mongodb://localhost:27017/NITT");
const express=require("express");
const app=express();


//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

// app.get("/:universalURL", (req, res) => {
//     res.send("404 URL NOT FOUND");
// });

app.listen(5000,()=>{
    console.log("connected server is running ");
})