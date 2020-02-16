require('dotenv').config()
require('../../database/mongo')()
require('./generalFunctions')()

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.post('/login', async (req, res) => {
    let id = userCheck(req.body.email)
    console.log(id + " " + req.body.email)
    if(!id) {
        return res.status(400).send("User doesn't exist");
    }
    try {
        if( await bcrypt.compare(req.body.password, users[id].password)){
            const userData = { userId: id }
            const accessToken = generateAccessToken(userData);
            const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
            refreshTokens.push(refreshToken);
            const cookieOptions = {
                httpOnly: true,
                expires: 0 
               }
            res.cookie('JWTToken', refreshToken, cookieOptions)
            res.json({accessToken: accessToken});
        }
        else
            res.status(401).send("email or password is incorrect");
    } catch {
        res.sendStatus(500);
    }
})

module.exports = router