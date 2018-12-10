(function() {
    var login = {
        dataUserDione: []
    };

    //Add event listeners for UI Elements
    document.getElementById('submitLogin').addEventListener('click', function(e) {
        e.preventDefault();
        login.getData();
    });

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

})();