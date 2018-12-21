(function() {
    var login = {
        dataUserDione: [],
        panelLogin: document.querySelector('#lLogin'),
        panelRegister: document.querySelector('#lRegister'),
        panelConfirm: document.querySelector('#lConfirm'),
        panelDash: document.querySelector('#dash-panel'),
        panelMap: document.querySelector('#dash-shops'),
        btnIndex: document.querySelectorAll('.index-dash'),
        btnLogin: document.querySelectorAll('.login-view'),
        btnNewAccount: document.querySelectorAll('.create-account')
    };

    //Add event listeners for UI Elements
    document.getElementById('submitLogin').addEventListener('click', function(e) {
        e.preventDefault();
        login.getData();
    });

    document.getElementById('submitCreate').addEventListener('click', function(e) {
        e.preventDefault();
        //Add code here for register account
        login.panelConfirm.style.display = 'block';
        login.panelRegister.style.display = 'none';
    });

    document.getElementById('submitConfirm').addEventListener('click', function(e) {
        e.preventDefault();
        //Add code here register user
    });

    for (let i = 0; i < login.btnNewAccount.length; i++) {
        login.btnNewAccount[i].addEventListener('click', function() {
            login.panelRegister.style.display = 'block';
            login.panelDash.style.display = 'none';
            login.panelLogin.style.display = 'none';
        });
    }

    for (let i = 0; i < login.btnLogin.length; i++) {
        login.btnLogin[i].addEventListener('click', function() {
            login.panelLogin.style.display = 'block';
            login.panelDash.style.display = 'none';
            login.panelRegister.style.display = 'none';
            login.panelConfirm.style.display = 'none';
        });
    }

    for (let i = 0; i < login.btnIndex.length; i++) {
        login.btnIndex[i].addEventListener('click', function() {
            login.panelDash.style.display = 'block';
            login.panelLogin.style.display = 'none';
            login.panelRegister.style.display = 'none';
            login.panelConfirm.style.display = 'none';
        });
    }

    login.getData = function() {
        var mail = document.getElementById('txtEmail').value.trim();
        var pass = document.getElementById('txtPassword').value;
        if (mail && pass) {
            login.startSession(mail, pass);   
        } else {
            console.log("Add data");
        }
    };

    login.startSession = function (mail, pass) {
        var url = 'https://dione.blueboy.studio/ws/Acceso/login_usuario.php';
        //Add web service code here
        // if ('caches' in window) {
        //     /*
        //     * Check if the service worker has already cached this web service
        //     * data. If the service worker has the data, then display the cached
        //     * data while the app fetches the latest data.
        //     */
        //     caches.match(url).then(function(response) {
        //         if (response) {
        //             response.json().then(function updateFromCache(json) {
        //                 login.dataUserDione = data;
        //                 login.saveDataUser();
        //                 window.location.replace('dashboard.html');
        //             });
        //         }
        //     });
        // }
        //Fetch data for start session
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var data = JSON.parse(request.response);
                    if (data) {
                        login.dataUserDione = data;
                        login.saveDataUser();
                        window.location.replace('dashboard.html');
                    } else {
                        console.log(data);
                    }
                }
            } else {
                //console.log(request.status);
                //Error WebService
            }
        };

        var dataJSON = {'login': mail, 'tarjeta': pass, 'token': '616'};
        request.open('POST', url, true);
        request.setRequestHeader('content-type', 'application/json');
        request.send(JSON.stringify(dataJSON));
    };

    login.saveDataUser = function () {
        localStorage.dataUserDione = JSON.stringify(login.dataUserDione);
    };

    /*login.createCookie = function() {
        setCookie("ld", "true", "100")
    };

    login.createCookie();

    login.checkCookie = function() {        
        var dr = getCookie("ld");
        if (typeof(dr) !== "undefined" && dr !== "null" && dr === "true") {
            window.location.replace('dashboard.html');
        }
    };

    login.checkCookie();*/

})();