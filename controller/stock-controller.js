const express = require('express');
const router = express.Router();
const stockQuery = require('../database/stock-query');
router.post('/' , (req , res , next) => {
    stockQuery.createStock(req , res);
})

module.exports = router;