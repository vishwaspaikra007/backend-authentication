require('dotenv').config()
require('../../database/mongo')()
require('./generalFunctions')()

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.post('/token', (req, res) => {
    console.log(refreshTokens);
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(403)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name})
        res.json({ accessToken: accessToken})
    })
})

module.exports = router