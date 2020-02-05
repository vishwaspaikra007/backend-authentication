require('dotenv').config()

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');


app.use(cookieParser());

app.use(express.json());


const posts = []

app.get('/posts', authenticateToken, (req, res) => {
    console.log(posts);
    res.json(posts.filter(post => post.username === req.user.username))
})

let users = [];


app.get('/signup', (req, res) => {
    res.render('signup.ejs');
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.clearCookie('JWTToken');
    res.sendStatus(204);
})

app.post('/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username);
    if(!user) {
        return res.status(400).send("User doesn't exist");
    }
    try {
        if( await bcrypt.compare(req.body.password, user.password)){
            const username = req.body.username;
            const userData = { username: username }
            const accessToken = generateAccessToken(userData);
            const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
            refreshTokens.push(refreshToken);
            const cookieOptions = {
                httpOnly: true,
                expires: 0 
               }
            res.cookie('JWTToken', refreshToken, cookieOptions)
            res.json({accessToken: accessToken, refreshToken: refreshToken});
        }
        else
            res.send("Not Allowed");
    } catch {
        res.sendStatus(500);
    }
})

app.post('/signup', async (req, res) => {


    const userCheck = users.find(user => user.username === req.body.username);
    if(userCheck) {
        return res.send("Username already exist");
    }
    
    try {

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt)
        console.log(hashedPassword)
        const user = { username: req.body.username, password: hashedPassword }
        users.push(user)
        console.log(users)
        // res.sendStatus(201);

        // Authenticate user

        const username = req.body.username;
        const userData = { username: username }
        const accessToken = generateAccessToken(userData);
        const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        posts.push({username: req.body.username, post: Math.floor(Math.random() *100 + 1)})

        const cookieOptions = {
            httpOnly: true,
            expires: 0 
           }
        res.cookie('JWTToken', refreshToken, cookieOptions)
        res.json({accessToken: accessToken, refreshToken: refreshToken});
    } catch {
        res.sendStatus(500);
    }
     
})

let refreshTokens = [];

app.post('/token', (req, res) => {
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

app.get('/token', (req, res) => {
    // console.log(req.cookies.JWTToken)
    // res.send(req.cookies.JWTToken);

    const refreshToken = req.cookies.JWTToken
    if (refreshToken == null) return res.sendStatus(403)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ username: user.username})
        res.json({ accessToken: accessToken})
    })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '25s'});
}   

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const PORT = process.env.PORT | 3000
app.listen(PORT, () => {
    console.log("app is listening on " + PORT);
});