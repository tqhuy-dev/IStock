const express = require('express');
const router = express.Router();

router.post('/' , (req , res , next) => {
    return res.status(200).json({
        api: 'create stock'
    })
})

module.exports = router;