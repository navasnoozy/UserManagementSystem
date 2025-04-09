const User =require('../models/userModel');
const bcrypt = require('bcrypt');
const {validationResult } = require('express-validator')

const securePassword = async (password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async (req,res)=>{
    try {
        res.render('registration');
    } catch (error) {
        console.log(error.message);
    }
};

const insertUser = async (req,res)=>{

 

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('registration',{message:errors.array().map(err=>err.msg).join()})
    }

    try {
        const spassword = await securePassword(req.body.password);
        const user = new User ({
            name:req.body.name,
            email:req.body.email,
            password:spassword,
            is_admin:0
        });

        const userData = await user.save();

        if(userData){
            res.render('registration',{
                message:'Your registration has been successfull',});
        }else{
            res.render('registration',{message:'Your registration failed'})
        }
    } catch (error) {
        console.log(error.message);
        
    }
};

    const loginLoad = async (req,res)=>{
       try {
        res.render('login')
       } catch (error) {
        console.log(error.message);
       }
    };


    const verifyLogin = async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('login',{message:errors.array().map(err=>err.msg).join()})
        }

        try {
            const {email,password} = req.body;

            const userData = await User.findOne({email:email});
 
            if(userData){
                const passwordMatch = await bcrypt.compare(password,userData.password);
                if(passwordMatch){
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }else{
                    res.render('login',{message:'Invalid login id or password'});
                }

            }else{
                res.render('login',{message:'Invalid login id or password'});
            }

        } catch (error) {
            console.log(error.message);
        }
    };

    const loadHome = async (req,res)=>{
        try {
            const userData = await User.findById({_id:req.session.user_id});
            res.render('home',{user:userData});
        } catch (error) {
            console.log(error.message);
        }
    };


    const userLogout = async (req,res)=>{
        try {
            req.session.destroy();
            res.redirect('/login')
        } catch (error) {
            console.log(error.message);
        }
    };


module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}