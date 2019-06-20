const express = require('express');
const router = express.Router();
const stockQuery = require('../database/stock-query');

//edit information of stock
router.post('/:id' , (req , res , next) => {
    stockQuery.editStock(req , res);
})
//add stock
router.post('/' , (req , res , next) => {
    stockQuery.createStock(req , res);
})

//retrieve stock
router.get('/' , (req , res , next) => {
    stockQuery.getStock(req , res);
})



module.exports = router;