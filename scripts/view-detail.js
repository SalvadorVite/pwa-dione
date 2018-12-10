(function() {
    var viewDetail = {
        container: document.getElementById('slider'),
        sliderTemplate: document.querySelector('.slideTemplate'),
        infoPromotion: [],
        titlePromotion: document.querySelector('.title-promo-detail'),
        hashtag: document.querySelector('.hashtag')
    };

    //Event listeners for UI elements
    document.getElementById('butListPromotions').addEventListener('click', function() {
        alert("Ir a lista butNotifications");
    });

    document.getElementById('butBack').addEventListener('click', function() {
        window.location.replace('dashboard.html');
    });


    viewDetail.detailPromo = function() {
        viewDetail.infoPromotion = localStorage.infoDetailPromotion;
        if(viewDetail.infoPromotion !== "null" && typeof(viewDetail.infoPromotion) !== "undefined") {
            viewDetail.infoPromotion = JSON.parse(viewDetail.infoPromotion);
            viewDetail.updateCard(viewDetail.infoPromotion);
        } else {
            viewDetail.getPromotionById();
        }
    };

    viewDetail.updateCard = function(data) {
        var image = data[0].banner;
        var sliderImg = viewDetail.sliderTemplate.cloneNode(true);
        sliderImg.classList.remove('slideTemplate');
        sliderImg.classList.add('cardSlide');
        sliderImg.removeAttribute('hidden');
        sliderImg.setAttribute('data-event', data[0].id_evento);
        sliderImg.style.backgroundImage = 'url('+image+')';
        viewDetail.container.appendChild(sliderImg);
        viewDetail.titlePromotion.textContent = data[0].encabezado;
    };

    viewDetail.getPromotionById = function() {
        var id_evento = localStorage.idEvent;
        var url = 'https://dione.blueboy.studio/ws/Generales/obtener_evento.php?id_evento='+id_evento;
        if ('caches' in window) {
            caches.match(url).then(function(response) {
                if (response) {
                    response.json().then(function updateFromCache(json) {
                        var data = json;
                        viewDetail.updateCard(data);
                    });
                }
            });
        }

        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    viewDetail.updateCard(response);
                }
            } else {
                //Return fake data (banner, text)
                //dash.updatePromotions(data);
            }
        };

        var dataJSON = {'token': '616', 'id': id_evento};
        request.open('POST', url, true);
        request.setRequestHeader('content-type', 'application/json');
        request.send(JSON.stringify(dataJSON));
    };

    viewDetail.detailPromo();
})();