(function() {
    var listNotif = {
        dashDetailPromo: document.querySelector('#dash-detail-promo'),
        dashListNotif: document.querySelector('#dash-list-promos'),
        dashPanel: document.querySelector('#dash-panel'),
        notifications: document.getElementsByClassName('item-notif'),
        cardsDetails: document.getElementsByClassName('details-notif'),
        infoNotifs: [],
        cardNotifTemplate: document.querySelector('.card-notif-template'),
        container: document.querySelector('.main-list')
    };

    //Event listeners for UI elements ViewDetail
    document.getElementById('butNotifications').addEventListener('click', function() {
        listNotif.dashListNotif.style.display = 'block';
        listNotif.dashPanel.style.display = 'none';
        listNotif.hideCardsNotif();
    });

    document.getElementById('butListPromotions').addEventListener('click', function() {
        listNotif.dashListNotif.style.display = 'block';
        listNotif.dashDetailPromo.style.display = 'none';
        listNotif.hideCardsNotif();
    });

    listNotif.getNotifs = function() {
        var url = 'https://dione.blueboy.studio/ws/Generales/obtener_notificaciones.php';
        //Add web service code here
        if ('caches' in window) {
            /*
            * Check if the service worker has already cached this web service
            * data. If the service worker has the data, then display the cached
            * data while the app fetches the latest data.
            */
            caches.match(url).then(function(response) {
                if (response) {
                    response.json().then(function updateFromCache(json) {
                        var data = json;
                        listNotif.infoNotifs = json;
                        listNotif.saveNotifs();
                        listNotif.updateNotifs(data);
                    });
                }
            });
        }
        //Fetch de latest data.
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    listNotif.infoNotifs = response;
                    listNotif.saveNotifs();
                    listNotif.updateNotifs(response);
                }
            } else {
                //Return fake data (banner, text)
                //dash.updatePromotions(data);
            }
        };

        var dataJSON = {'token': '616'};
        request.open('POST', url, true);
        request.setRequestHeader('content-type', 'application/json');
        request.send(JSON.stringify(dataJSON));
    };

    listNotif.updateNotifs = function(data) {
        for (let i = 0; i < data.length; i++) {
            var image = data[i].portada;
            var card = listNotif.cardNotifTemplate.cloneNode(true);
            var img = card.getElementsByTagName('img');
            card.classList.remove('card-notif-template');
            card.classList.add('item-notif');
            card.removeAttribute('hidden');
            card.setAttribute('data-detail', data[i].id_evento);
            img[0].src = image;
            var divDetail = card.querySelector('.details-notif');
            var divTitle = card.querySelector('.title-notification');
            var divText = card.querySelector('.text-notification');
            divDetail.setAttribute('id', data[i].id_evento);
            divTitle.textContent = data[i].encabezado;
            divText.textContent = data[i].cuerpo;
            listNotif.container.appendChild(card);
        }
        listNotif.seePreview();
    };

    listNotif.seePreview = function() {
        listNotif.notifications = document.getElementsByClassName('item-notif');
        for (let i = 0; i < listNotif.notifications.length; i++) {
            listNotif.notifications[i].addEventListener('click', listNotif.showDetailNotif, false);
        }
    };

    listNotif.hideCardsNotif = function () {
        for (let index = 0; index < listNotif.cardsDetails.length; index++) {
            listNotif.cardsDetails[index].classList.add('hide-notif');
        }
    };

    listNotif.showDetailNotif = function() {
        listNotif.hideCardsNotif();
        var idDetail = (this).dataset.detail;
        var viewDetail = document.getElementById(''+idDetail+'');
        viewDetail.classList.remove('hide-notif');
    };

    document.getElementById('butHomeList').addEventListener('click', function() {
        listNotif.dashPanel.style.display = 'block';
        listNotif.dashListNotif.style.display = 'none';
    });

    listNotif.saveNotifs = function() {
        var infoNotifs = JSON.stringify(listNotif.infoNotifs);
        localStorage.infoNotifs = infoNotifs;
    };

    listNotif.infoNotifs = localStorage.infoNotifs;
    if (listNotif.infoNotifs) {
        listNotif.infoNotifs = JSON.parse(listNotif.infoNotifs);
        listNotif.updateNotifs(listNotif.infoNotifs);
    } else {
        listNotif.getNotifs();
    }

})();