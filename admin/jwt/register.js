require('dotenv').config()
require('../../database/mongo')()
require('./generalFunctions')()

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
    console.log(req.body)

    if(userCheck(req.body.email)) {
        return res.send("email already in use");
    }
    
    try {

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const userId = req.body.userId || Math.random(16).toString(16).slice(7) + Date.now().toString();
        const user = { 
            userId: userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            post: `hello ${req.body.firstName} ! <br> welcome to vishwas Oauth Signin`
        }
        users[userId] = user
        console.log(users)
        // res.sendStatus(201);

        // Authenticate user

        const userData = { userId: userId }
        const accessToken = generateAccessToken(userData);
        const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);

        const cookieOptions = {
            httpOnly: true,
            expires: 0  
           }
        res.cookie('JWTToken', refreshToken, cookieOptions)
        res.send({accessToken: accessToken});
    } catch(err) {
        console.log(err)
        res.sendStatus(500);
    }
    
})

module.exports = router