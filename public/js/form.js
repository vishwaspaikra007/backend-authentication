var id_token;

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    id_token = googleUser.getAuthResponse().id_token;
    // showConatiner();
    verifyGoogleUser();
    console.log("ID Token: " + id_token);
}

function verifyGoogleUser() {
    axios.post('/verifyGoogleUser', { idToken: id_token })
    .then(res => {
        let forms = document.querySelector('.forms');
        console.log(res)
        if(res.data.type !== 'post') {
        forms.innerHTML = res.data; 
        checkInput()
        firstElementIntoFocus(4);
        } else {
        forms.innerHTML = res.data.post.post;            
        }
    })
}

function firstElementIntoFocus(i) {
    let inputs = document.querySelectorAll('input')
        inputs[i].focus();
}

function register() {
    axios.get('/register')
    .then(res => {
        console.log(res.data);
        let forms = document.querySelector('.forms');
        forms.innerHTML = res.data; 
        checkInput()
        firstElementIntoFocus(0);
    })
}
function login() {
    axios.get('/login')
    .then(res => {
        let forms = document.querySelector('.forms');
        forms.innerHTML = res.data; 
        checkInput()
        firstElementIntoFocus(0);
    })
}
// google signout
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
    id_token = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("createdAt");
    axios.defaults.headers.common['Authorization'] = "";      
    axios.get('/removeRefreshToken')
    .then(res => {
        console.log("refresh Token removed")
    }).catch(err => {
        console.log(err + "refresh Token removal process failed")
    })
    // showConatiner();
}

function showConatiner() {
    var vpContainer = document.querySelector('.vpContainer');
    var signOut = document.querySelector('.signOut');
    if (id_token) {
    vpContainer.style.display = "none";
    signOut.style.display = "block";
    }
    else {
    vpContainer.style.display = "flex";
    signOut.style.display = "none";
    }
}
checkInput();

function checkInput() {
    let input = document.querySelectorAll('input')
    input.forEach(x => {
    if(x.value && x.type != "submit" && x.id != "userId")
        check(x);
    })
}

function moveUp(ths) {

    ths.style.border = "2px solid black";
    let eleSpan = document.querySelector('#' + ths.id + ' + Span');
    eleSpan.innerHTML = eleSpan.attributes.textAfterEntry.value
    eleSpan.style.top = '-60px';
    eleSpan.style.color = 'black';
    ths.style.color = "black";
}
function moveDown(ths) {

    ths.style.border = "2px solid grey";
    let eleSpan = document.querySelector('#' + ths.id + ' + Span');
    if(ths.value == "") {
        eleSpan.style.top = '-28px';
        eleSpan.innerHTML = eleSpan.attributes.textBeforeEntry.value
    }
    eleSpan.style.color = 'gray';
    ths.style.color = "grey";

}
function check(ths) {

    console.log("hello")
    moveUp(ths);
    // if(!ths.value)
    moveDown(ths);
    
}

// to select an element
function select(ele) {
    return document.querySelector(ele);
}
// to get form values as key-value pair object
function getFormValues(e) {
    let elements = e.target.elements;
    let elementListObject = {};
    for(element of elements) {
        if(element.type != "submit") {
            elementListObject[element.name] = element.value;            
            element.value = "";
        }
    }
    return elementListObject
}