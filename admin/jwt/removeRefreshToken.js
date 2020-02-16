require('dotenv').config()
require('../../database/mongo')()
require('./generalFunctions')()

const express = require('express')
const router = express.Router()

router.get('/removeRefreshToken', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    
    res.clearCookie('JWTToken');
    res.sendStatus(204);

})

module.exports = router