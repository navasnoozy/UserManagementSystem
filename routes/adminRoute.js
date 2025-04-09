const express = require("express");
const admin_route = express();
const session = require("express-session");
const config = require("../config/config");
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const { registerValidation, loginValidation } = require('../middleware/validator')

admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));

admin_route.use(
    session({
      secret: config.sessionSecret,
      resave:false,
      saveUninitialized:true,
    })
  );

admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

admin_route.get('/',adminAuth.isLogout,adminController.loginLoad);

admin_route.post('/',loginValidation,adminController.verifyLogin);

admin_route.get('/home',adminAuth.isLogin,adminController.loadDashboard);

admin_route.get('/dashboard',adminAuth.isLogin,adminController.adminDashboard);

admin_route.get('/logout',adminAuth.isLogin,adminController.logout);

admin_route.get('/adduser',adminAuth.isLogin,adminController.loadadduser);

admin_route.post('/adduser',adminAuth.isLogin,adminController.addUser);

admin_route.get('/edituser',adminAuth.isLogin,adminController.editUserload);

admin_route.post('/edituser',adminAuth.isLogin,adminController.updateUser);



admin_route.get('/deleteuser',adminAuth.isLogin,adminController.deleteUser);

admin_route.post('/search',adminAuth.isLogin,adminController.search)



admin_route.get('*',(req,res)=>{
    res.redirect('/admin')
});

module.exports = admin_route;