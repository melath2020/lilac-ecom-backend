const User=require('../models/userModel');
const asyncHandler=require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshtoken');
const { generateToken } = require('../config/jwtToken');

// Create a user
const createUser=asyncHandler(
    async(req,res)=>{
        const email=req.body.email;
        const findUser=await User.findOne({email:email});
        if(!findUser){
            // Create new user
            const newUser=await User.create(req.body);
            res.json(newUser);
    
        }else{
            // User already Exist
          throw new Error('User Already Exist');
        }
    });

    // Login a user
    const loginUserCtrl=asyncHandler(async(req,res)=>{
        const {email,password}=req.body;
        // check if user exist or not
        const findUser=await User.findOne({email});
        if(findUser && await findUser.isPasswordMatched(password)){
            const refreshToken= await generateRefreshToken(findUser?._id)
            const updateuser=await User.findOneAndUpdate(findUser.__id,{
              refreshToken:refreshToken,
            },{
              new:true,
            })
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                maxAge:72*60*60*1000,
            })
            res.json({
                _id:findUser?._id,
                firstname:findUser?.firstname,
                lastname:findUser?.lastname,
                email:findUser?.email,
                mobile:findUser?.mobile,
                token:generateToken(findUser?._id)
            });

        }else{
            throw new Error("Invalid Credentials")
        }
    })



        // Logout functionality

        const logout=asyncHandler(async(req,res)=>{
            const cookie=req.cookies;
       
             if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
             const refreshToken=cookie.refreshToken; 
             const user=await User.findOne({refreshToken})
             if(!user){
              res.clearCookie('refreshToken',{
                httpOnly:true,
                secure:true,
              })
              return res.sendStatus(204);  //forbitten
             }
             await User.findOneAndUpdate({refreshToken},{
              refreshToken:"",
             })
             res.clearCookie('refreshToken',{
              httpOnly:true,
              secure:true,
            });
            return res.sendStatus(204);  //forbitten
             
          })




    module.exports={createUser,loginUserCtrl,logout}