const User=require('../models/userModel');
const asyncHandler=require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshtoken');
const { generateToken } = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongodbId');
const Cart=require('../models/cartModel');


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

          
    const userCart=asyncHandler(async(req,res,next)=>{
      const { productId,quantity,price } = req.body;
      const { _id } = req.user;
      validateMongoDbId(_id);
      try {
       
       let newCart=await new Cart({
        userId:_id,
        quantity,
        productId,
        price,
        

       }).save()
       res.json(newCart)
      }catch(error){
        throw new Error(error)
      }

    })

    const getUserCart=asyncHandler(async(req,res)=>{
      const {_id}=req.user;
      validateMongoDbId(_id);
      try{
        const cart=await Cart.find({userId:_id}).populate("productId");
        res.json(cart)
      }catch(error){
        throw new Error
      }
    })

    const removeProductFromCart=asyncHandler(async(req,res)=>{
      const { _id } = req.user;
      const {cartItemId}=req.params;
      validateMongoDbId(_id);
      try{
        const deleteProductFromCart=await Cart.deleteOne({userId:_id,_id:cartItemId})
        res.json(deleteProductFromCart)
      }catch(error){
        throw new Error
      }

    })


    
    

    const updateProductQuantityFromCart =asyncHandler(async(req,res)=>{
      const { _id } = req.user;
      const {cartItemId,newQuantity}=req.params;
      validateMongoDbId(_id);
      try{
        const cartItem=await Cart.findOne({userId:_id,_id:cartItemId})
        cartItem.quantity=newQuantity
        cartItem.save()
        res.json(cartItem)
      }catch(error){
        throw new Error
      }
    })





    module.exports={createUser,loginUserCtrl,logout,userCart,removeProductFromCart,getUserCart,updateProductQuantityFromCart}