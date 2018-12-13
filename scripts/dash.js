(function() {
    //Add Dashboard code here
    var dash = {
        visibleSliders: true,
        infoPromotions: [],
        dataUser: [],
        container: document.getElementById('slider'),
        sliderTemplate: document.querySelector('.slideTemplate'),
        dashPanel: document.querySelector('#dash-panel'),
        dashDetailPromo: document.querySelector('#dash-detail-promo')
    };

    //Event listeners for UI elements
    document.getElementById('butProfile').addEventListener('click', function() {
        alert("Ir a butProfile");
    });

    dash.getPromotions = function() {
        var url = 'https://dione.blueboy.studio/ws/Generales/promociones.php';
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
                        dash.infoPromotions = json;//Save data get from ws
                        dash.savePromotions();
                        dash.updatePromotions(data);
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
                    dash.infoPromotions = response;//Save data get from ws
                    dash.savePromotions();
                    dash.updatePromotions(response);
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

    dash.updatePromotions = function(data) {
        for (let i = 0; i < data.length; i++) {
            var image = data[i].banner;
            var sliderImg = dash.sliderTemplate.cloneNode(true);
            sliderImg.classList.remove('slideTemplate');
            sliderImg.classList.add('cardSlide');
            sliderImg.removeAttribute('hidden');
            sliderImg.setAttribute('data-event', data[i].id_evento);
            sliderImg.style.backgroundImage = 'url('+image+')';
            dash.container.appendChild(sliderImg);
        }
        slider.startSlide();
        view.showDetailEvent();
    };

    dash.getLastPromotion = function() {
        var url = 'https://dione.blueboy.studio/ws/Generales/ultimo_promocion.php';
        if ('caches' in window) {
            caches.match(url).then(function(response) {
                if (response) {
                    response.json().then(function updateFromCache(json) {
                        var data = json;
                        if (data) {
                            dash.updateLastPromotion(data);
                        }
                        dash.updateLastPromotion(data);
                    });
                }
            });
        }

        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    if (response) {
                        dash.updateLastPromotion(response);
                    }
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

    dash.updateLastPromotion = function(data) {
        var titleLastPromotion = document.querySelector('.title-promo');
        var subtitleLastPromotion = document.querySelector('.sub-promo');
        titleLastPromotion.textContent = data[0].nombre;
        subtitleLastPromotion.textContent = data[0].cuerpo;
    };

    dash.updateDataUser = function() {
        dash.dataUser = localStorage.dataUserDione;
        var dataUser = JSON.parse(dash.dataUser);
        var userName = document.querySelector('.user-name');
        var dioneLevel = document.querySelector('.dione-level');
        var dionePoints = document.querySelector('.dione-points');
        userName.textContent = dataUser[0].nombres + ' ' + dataUser[0].ape_materno;
        var levelDione = dash.getLevelDione(dataUser[0].puntos);
        dioneLevel.textContent = levelDione.levelText;
        dioneLevel.classList.add(levelDione.levelClass);
        dionePoints.textContent = dataUser[0].puntos;
    };

    dash.getLevelDione = function(p) {
        var level = {levelText: 'Plata', levelClass: 'silver'};
        if (p >= 0 && p < 10000) {
            level = {levelText: 'Plata', levelClass: 'silver'};
        } else if(p >= 10000 && p < 20000) { 
            level = {levelText: 'Oro', levelClass: 'gold'};
        } else if(p >= 20000) {
            level = {levelText: 'Platino', levelClass: 'platinum'};
        }
        return level;
    };

    //Add sliders code here
    var slider = {
        sliderImages: document.querySelectorAll('.cardSlide'),
        arrowLeft: document.getElementById('arrow-left'),
        arrowRight: document.getElementById('arrow-right'),
        current: 0
    };

    slider.reset = function() {
        for (let index = 0; index < slider.sliderImages.length; index++) {
            slider.sliderImages[index].style.display = 'none';
        }
    };

    slider.startSlide = function() {
        slider.sliderImages = document.querySelectorAll('.cardSlide');
        slider.reset();
        slider.sliderImages[0].style.display = 'block';
    };

    slider.slideLeft = function() {
        slider.reset();
        slider.sliderImages[slider.current - 1].style.display = 'block';
        slider.current--;
    };

    slider.slideRight = function() {
        slider.reset();
        slider.sliderImages[slider.current + 1].style.display = 'block';
        slider.current++;
    };

    slider.arrowLeft.addEventListener("click", function() {
        if (slider.current === 0) {
            slider.current = slider.sliderImages.length;
        }
        slider.slideLeft();
    });

    slider.arrowRight.addEventListener("click", function() {
        if (slider.current === slider.sliderImages.length - 1) {
            slider.current = -1;
        }
        slider.slideRight();
    });
    
    setInterval(function() {
        slider.arrowRight.click();
    }, 5000);

    //Add detail promotions code here
    var view = {
        promos: document.getElementsByClassName('cardSlide')
        //promos: document.querySelectorAll('.cardSlide')
    }

    view.showDetailEvent = function() {
        view.promos = document.getElementsByClassName('cardSlide')
        for (let i = 0; i < view.promos.length; i++) {
            view.promos[i].addEventListener('click', view.showDetailPromo, false);
        }
    };

    view.showDetailPromo = function() {
        var data = dash.getInfoPromotions();
        var evento = (this).getAttribute('data-event');
        localStorage.setItem('idEvent', evento);
        if (data) {
            for (let index = 0; index < data.length; index++) {
                if (data[index].id_evento == evento) {
                    var infoPromotion = [];
                    infoPromotion.push(data[index]);
                    localStorage.setItem('infoDetailPromotion', JSON.stringify(infoPromotion));
                }
            }
        } else {
            localStorage.setItem('infoDetailPromotion', null);
        }
        dash.dashDetailPromo.style.display = 'block';
        dash.dashPanel.style.display = 'none';
        viewDetail.detailPromo();
    };

    dash.savePromotions = function() {
        var infoPromotions = JSON.stringify(dash.infoPromotions);
        localStorage.infoPromotions = infoPromotions;
    };

    dash.getInfoPromotions = function() {
        var infoPromotions = localStorage.infoPromotions;
        if (infoPromotions) {
            infoPromotions = JSON.parse(infoPromotions);
        } else {
            infoPromotions = null;
        }
        return infoPromotions;
    };

    //Add ViewDetail code here
    var viewDetail = {
        container: document.getElementById('sliderDetail'),
        sliderTemplate: document.querySelector('.slideTemplateDetail'),
        infoPromotion: [],
        titlePromotion: document.querySelector('.title-promo-detail'),
        hashtag: document.querySelector('.hashtag')
    };

    //Event listeners for UI elements ViewDetail
    document.getElementById('butBack').addEventListener('click', function() {
        dash.dashPanel.style.display = 'block';
        dash.dashDetailPromo.style.display = 'none';
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
        var sliderImg = viewDetail.sliderTemplate;
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

    dash.infoPromotions = localStorage.infoPromotions;
    dash.dataUser = localStorage.dataUserDione;
    if (dash.infoPromotions && dash.dataUser) {
        dash.infoPromotions = JSON.parse(dash.infoPromotions);
        dash.updatePromotions(dash.infoPromotions);
        dash.updateDataUser();
    } else {
        dash.getPromotions();
        dash.getLastPromotion();
        dash.updateDataUser();
    }

})();