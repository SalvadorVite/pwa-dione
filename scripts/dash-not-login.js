(function() {
    var dash = {
        infoPromotions: [],
        container: document.getElementById('slider'),
        sliderTemplate: document.querySelector('.slideTemplate')
    };

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

    dash.savePromotions = function() {
        var infoPromotions = JSON.stringify(dash.infoPromotions);
        localStorage.infoPromotions = infoPromotions;
    };

    dash.updatePromotions = function(data) {
        for (let i = 0; i < data.length; i++) {
            var image = data[i].banner;
            var sliderImg = dash.sliderTemplate.cloneNode(true);
            var title = sliderImg.querySelector('.title-slider-d');
            var subtitle = sliderImg.querySelector('.subtitle-slider-d');
            var divpointers = sliderImg.querySelector('.pointers');
            for (let j = 0; j < data.length; j++) {
                var spanClass = (j === i) ? 'dot dot-black' : 'dot dot-gray';
                var span = document.createElement('span');
                span.className = spanClass;
                divpointers.appendChild(span);
            }
            sliderImg.classList.remove('slideTemplate');
            sliderImg.classList.add('cardSlide');
            sliderImg.removeAttribute('hidden');
            sliderImg.setAttribute('data-event', data[i].id_evento);
            sliderImg.style.backgroundImage = 'url('+image+')';
            title.textContent = data[i].nombre;
            subtitle.textContent = data[i].cuerpo;
            dash.container.appendChild(sliderImg);
        }
        slider.startSlide();
        //view.showDetailEvent();
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

    dash.getPromotions();
})();