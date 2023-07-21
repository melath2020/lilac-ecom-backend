const express = require("express");
const { createProduct, getaProduct, getAllProduct } = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware,isAdmin, createProduct);
router.get('/:id',authMiddleware,getaProduct);
router.get('/',getAllProduct);

module.exports = router;
