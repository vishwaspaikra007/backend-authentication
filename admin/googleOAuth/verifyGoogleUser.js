const express = require('express')
const { OAuth2Client } = require('google-auth-library')
require('../../database/mongo')()

let router = express()

router.post('/verifyGoogleUser', (req, res) => {
    const idToken = req.body.idToken;
    // client id = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com'
    const client = new OAuth2Client('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com');
    async function verify() {
        try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        console.log(userId)

        if(!(userId in users)) {
            console.log(payload)
            res.render('partials/register.ejs', {values: payload})
        }
        else {
            console.log(userId)
            console.log(users)
            post = users[userId]
            res.send({post: post, type:'post'})
        }
        }
        catch(err) {
            console.log(err);
        }

        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
    verify().catch(error => {
        console.error()
        res.send({error: error, message: "not signed in"})})
})


module.exports = router