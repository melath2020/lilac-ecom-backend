const express = require("express");
const { createProduct, getaProduct, getAllProduct } = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware, createProduct);
router.get('/:id',getaProduct);
router.get('/',getAllProduct);

module.exports = router;
