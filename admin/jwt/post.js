require('dotenv').config()
require('../../database/mongo')()
require('./generalFunctions')()

const express = require('express')
const router = express.Router()

router.get('/getPost', authenticateToken, (req, res) => {
    console.log(req.user.userId);
    res.send(users[req.user.userId].post);
})

module.exports = router;