const express = require('express')
const { OAuth2Client } = require('google-auth-library')
const path = require('path')
var cors = require('cors')
var cookieParser = require('cookie-parser');
const JWTLogin = require('./admin/jwt/login')
const JWTregister = require('./admin/jwt/register')
const post = require('./admin/jwt/post')
const refreshToken = require('./admin/jwt/refreshToken')
const verifyGoogleUser = require('./admin/googleOAuth/verifyGoogleUser')
const removeRefreshToken = require('./admin/jwt/removeRefreshToken')
const app = express()

require('./database/mongo')()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))
app.use(JWTLogin)
app.use(JWTregister)
app.use(post)
app.use(refreshToken)
app.use(verifyGoogleUser)
app.use(removeRefreshToken)

app.get("/auth", (req, res) => {
    res.render('auth.ejs');
})


app.get('/register', (req, res) => {
    res.render('partials/register.ejs', {values: {sub: undefined}});
})

app.get('/login', (req, res) => {
    res.render('partials/login.ejs');
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log("App is listening on port " + PORT)
})