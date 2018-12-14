(function() {
    var profile = {
        dashPanel: document.querySelector('#dash-panel'),
        dashProfile: document.querySelector('#dash-profile'),
        user: document.querySelector('.user-profile'),
        userData: []
    };

    //Event listeners for UI elements profile
    document.getElementById('butBackProfile').addEventListener('click', function() {
        profile.dashPanel.style.display = 'block';
        profile.dashProfile.style.display = 'none';
    });

    document.getElementById('butProfile').addEventListener('click', function() {
        profile.dashProfile.style.display = 'block';
        profile.dashPanel.style.display = 'none';
    });
    
    document.getElementById('logout').addEventListener('click', function(e) {
        profile.logout();
    });

    profile.logout = function() {
        //Create a dialog box confirm exit
        //Destroy session and replace login
        /*var r = confirm('Desea cerrar sesion?');
        if (r) {
            window.location.replace('login.html');
        } else {
            return;   
        }*/
        window.location.replace('login.html');
    };

    profile.getDataUser = function () {
        profile.userData = JSON.parse(localStorage.dataUserDione);
        return profile.userData;
    };

    profile.updateInfo = function() {
        var d = profile.getDataUser();
        profile.user.textContent = d[0].nombres + ' ' + d[0].ape_materno;
    };

    profile.updateInfo();

})();