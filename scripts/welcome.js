(function() {
    var welcome = {
        cards: 3
    };

    welcome.nextSlider = function() {
        var dataSlider = parseInt(this.getAttribute('data-slider'));
        dataSlider = dataSlider + 1;
        this.hidden = true;
        var slider = document.querySelector('[data-slider="' + dataSlider + '"]');
        if (dataSlider <= welcome.cards) {
            slider.removeAttribute('hidden');
        } else if (dataSlider === welcome.cards) {
            window.setTimeout(function() {
                window.location.replace("login.html");
                return false;
            }, 4000);
        } else if(dataSlider > welcome.cards) {
            window.location.replace("login.html");
            return false;
        }
    };

    var sliders = document.getElementsByClassName('welcome');

    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener('click', welcome.nextSlider, false);
    }
})();