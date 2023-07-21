const express=require('express');
const { createUser, loginUserCtrl, logout, userCart, getUserCart, emptyCart, removeProductFromCart, updateProductQuantityFromCart } = require('../controller/userCtrl');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router=express.Router();

router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.get("/logout",logout)
router.post('/cart',authMiddleware,userCart );
router.get('/cart',authMiddleware,getUserCart);
router.delete('/empty-cart',authMiddleware,emptyCart);
router.delete('/delete-product-cart/:cartItemId',authMiddleware,removeProductFromCart);
router.delete('/update-product-cart/:cartItemId/:newQuantity',authMiddleware,updateProductQuantityFromCart);



module.exports=router;


