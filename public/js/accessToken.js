function formActionRegister(e){
    e.preventDefault()
    axios.post('/register', getFormValues(e))
        .then(res => {
            setAccessTokenAndGetPost(res.data.accessToken);
        }).catch(err => {
            console.log(err)
        })
}


function formActionLogin(e) {
    e.preventDefault();
    axios.post('/login', getFormValues(e))
        .then(res => {
            setAccessTokenAndGetPost(res.data.accessToken);
        }).catch(error => {
            alert(error.response.status + " " + error.response.data);
        })
}

function setAccessTokenAndGetPost(JWTToken) {
    storeAndConfigAccessToken(JWTToken);
    setTimer(localStorage.getItem('createdAt'));
    getPost();
}

function init() {
    if (localStorage.getItem('accessToken')) {
         axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('accessToken');
         setTimer(localStorage.getItem('createdAt'));
         console.log(accessToken)
         if(accessToken) {
            getPost();
         } else {
             refreshToken();
         }
     }
}

function getPost() {
    // console.log(accessToken)
    axios.get('/getPost').then((res) => {
        console.log("from post")
        console.log(res.data)
    let forms = document.querySelector('.forms');
    forms.innerHTML = res.data; 
    })
}

function storeAndConfigAccessToken(JWTToken) {
    axios.defaults.headers.common['Authorization'] = "Bearer " + JWTToken;
    localStorage.setItem("accessToken", JWTToken);
    localStorage.setItem("createdAt", Date.now());
}

function setTimer(createdAt) {
    passedMinutes = (((Date.now() - createdAt)/1000));
    if(passedMinutes > 600)
        refreshToken();
    else
        setTimeout(() => {
            refreshToken();
        }, Math.abs(600 - passedMinutes)*1000);
        
}

function refreshToken() {
    axios.post('/token')
        .then( res => {
            // let set = select('#doc');
            // set.innerHTML = JSON.stringify(res.data);
            storeAndConfigAccessToken(res.data.accessToken);
            setTimer(localStorage.getItem('createdAt'));
        }).catch( err => {
            let set = select('#doc');
            set.innerHTML = err;
        })
}