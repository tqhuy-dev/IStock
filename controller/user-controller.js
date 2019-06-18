const express = require('express');
const router = express.Router();
const userQuery = require('../database/user-query');

router.get('/' , (req , res , next) => {
    userQuery.selectUser(req , res);
});

router.post('/signin' , (req , res , next) => {
    userQuery.createUser(req , res);
})

router.post('/login' , (req , res , next) => {
    userQuery.loginUser(req , res);
})

module.exports = router;