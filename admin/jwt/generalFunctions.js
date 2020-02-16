require('dotenv').config()
require('../../database/mongo')()

const jwt = require('jsonwebtoken')

module.exports = ()=> {


    generateAccessToken = (user) => {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m'});
    }   

    userCheck = (email) => {
        for( let i in users) {
            if(email == users[i].email)
                return i
        }
        return false
    }   

    authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    }

    refreshTokens = []

}