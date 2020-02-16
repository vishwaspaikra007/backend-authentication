## To create ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET for .env file
```
use node require('crypto').randomBytes(64).toString('hex') in the terminal console
```
## Google OAuth
Just search in the Internet to get a get client id from google in the from
```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```
**Steps to get Client ID from Google**
* [open google console](https://www.google.co.in/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=2ahUKEwjv896kxtbnAhVVfSsKHQjICkMQFjAAegQIBBAB&url=https%3A%2F%2Fconsole.cloud.google.com%2F&usg=AOvVaw1GxwHR1WZnDu0xsR-djCrv)
* search Google+ API
* enable the API (It will open it's overview page )
* click *create credentials*
* and then select **client ID** *from Find out what kind of credentials you need*
* then follow the steps "such as valid urls etc."
* then add client ID in the file -> admin/googleOAuth/verifyGoogleUser.js 