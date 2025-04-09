 const mongoose = require('mongoose');
 const express = require('express');
 const app = express();
 
 
 const PORT = process.env.PORT || 3040;

 mongoose.connect('mongodb://localhost:27017/user_management_system');

 //for user routes
const userRoute =require('./routes/userRoute')
app.use('/',userRoute);


//admin routes
const adminRoute =require('./routes/adminRoute')
app.use('/admin',adminRoute);


 app.listen(PORT,()=>{
    console.log('server UMS is running');
 });
