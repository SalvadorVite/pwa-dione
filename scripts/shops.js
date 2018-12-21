(function() {
    var shops = {
        dataShops: [],
        dashShops: document.querySelector('#dash-shops'),
        dashPanel: document.querySelector('#dash-panel'),
        panelLogin: document.querySelector('#lLogin'),
        addDialog: document.querySelector('.dialog-container'),
        cardShop: document.querySelector('.cardShop'),
        listContainer: document.querySelector('.dialog-body'),
        cardsShops: document.getElementsByClassName('item-shop'),
        butDashShops: document.querySelector('#butShops'),
        butDashShopsL: document.querySelector('#butShopsL')
    };

    //Event listeners for UI elements ViewDetail
    document.getElementById('butHomeShop').addEventListener('click', function() {
        shops.dashPanel.style.display = 'block';
        shops.dashShops.style.display = 'none';
    });

    if(shops.butDashShops) {
        document.getElementById('butShops').addEventListener('click', function() {
            shops.showMap();
            shops.dashShops.style.display = 'block';
            shops.dashPanel.style.display = 'none';
        });
        /*document.addEventListener('DOMContentLoaded', function(e) {
            
        });*/
    }

    if(shops.butDashShopsL) {
        document.getElementById('butShopsL').addEventListener('click', function() {
            shops.showMap();
            shops.dashShops.style.display = 'block';
            shops.panelLogin.style.display = 'none';
        });
    }

    document.getElementById('butListShops').addEventListener('click', function() {
        shops.toggleAddDialog(true);
    });

    document.getElementById('butShowAll').addEventListener('click', function() {
        shops.showMap();
        shops.toggleAddDialog(false);
    });

    document.getElementById('butAddCancel').addEventListener('click', function() {
        shops.toggleAddDialog(false);
    });

    // Toggles the visibility of the add new dialog.
    shops.toggleAddDialog = function(visible) {
        if (visible) {
            shops.addDialog.classList.add('dialog-container--visible');
        } else {
            shops.addDialog.classList.remove('dialog-container--visible');
        }
    };

    shops.showMap = function() {
        var data = shops.getShops();
        if (data === null) {
            shops.getData();
        } else {
            initMap(data);
        }
    };

    shops.addListShops = function(data) {
        for (let i = 0; i < data.length; i++) {
            var card = shops.cardShop.cloneNode(true);
            card.classList.remove('cardShop');
            card.classList.add('item-shop');
            card.removeAttribute('hidden');
            card.setAttribute('data-lat', data[i][1]);
            card.setAttribute('data-lng', data[i][2]);
            card.textContent = data[i][4];
            shops.listContainer.appendChild(card);
        }
        shops.selectShop();
    };

    shops.removeListShops = function() {
        for (let i = shops.cardsShops.length - 1; i >= 0 ; i--) {
            if (shops.cardsShops[i]) {
                shops.cardsShops[i].remove();   
            }
        }
    };

    shops.selectShop = function() {
        shops.cardsShops = document.getElementsByClassName('item-shop');
        for (let i = 0; i < shops.cardsShops.length; i++) {
            shops.cardsShops[i].addEventListener('click', shops.showOnMap, false);
        }
    };

    shops.showOnMap = function() {
        var arrMap = [];
        arrMap[0] = [];
        arrMap[0][0] = (this).textContent;
        arrMap[0][1] = (this).dataset.lat;
        arrMap[0][2] = (this).dataset.lng;
        initMap(arrMap);
        shops.toggleAddDialog(false);
    };

    shops.getData = function() {
        var url = 'https://dione.blueboy.studio/ws/Generales/tiendas.php';
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
                        var arrayShops = [];
                        arrayShops = shops.objectToArray(data);
                        initMap(arrayShops);
                        shops.removeListShops();
                        shops.addListShops(arrayShops);
                        shops.saveShops(arrayShops);
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
                    var arrayShops = [];
                    arrayShops = shops.objectToArray(response);
                    initMap(arrayShops);
                    shops.removeListShops();
                    shops.addListShops(arrayShops);
                    shops.saveShops(arrayShops);
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

    shops.objectToArray = function(objectShops) {
        var arrayShops = [];
        for (let i = 0; i < objectShops.length; i++) {
            arrayShops[i] = [];
            arrayShops[i][0] = '<b>' + objectShops[i].nombre + '</b><br>' + objectShops[i].direccion + ', ' + objectShops[i].ciudad + ', ' + objectShops[i].estado;
            arrayShops[i][1] = objectShops[i].latidud;
            arrayShops[i][2] = objectShops[i].longitud;
            arrayShops[i][3] = objectShops[i].telefono;
            arrayShops[i][4] = objectShops[i].nombre;
        }
        return arrayShops;
    };

    shops.getShops = function() {
        shops.dataShops = localStorage.dataShops;
        if(shops.dataShops !== "null" && typeof(shops.dataShops) !== "undefined") {
            shops.dataShops = JSON.parse(shops.dataShops);            
        } else {
            shops.dataShops = null;
        }
        return shops.dataShops;
    };

    shops.saveShops = function(data) {
        var dataShops = JSON.stringify(data);
        localStorage.dataShops = dataShops;
    };

    shops.getData();
})();

var map, marker, infowindow, markerMap = '../images/icons/icon-78x78.png';
var latMap = 20.7126691;
var lngMap = -103.4212615;
var zoomMap = 6;
var textMarker = 'Zapateria Dione';
function initMap(data) {
    if (data.length == 1) {
        latMap = data[0][1];
        lngMap = data[0][2];
        textMarker = data[0][0];
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: latMap, lng: lngMap},
            zoom: zoomMap
        });
        var bounds = new google.maps.LatLngBounds();
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(latMap, lngMap),
            label: 'D',
            map: map//,
            //icon: markerMap
        });

        infowindow = new google.maps.InfoWindow;
        infowindow.setContent(textMarker);
        infowindow.open(map, marker);
        marker.addListener('click', function() {
            map.setZoom(20);
            map.setCenter(marker.getPosition());
        });
        bounds.extend(marker.getPosition());
        map.fitBounds(bounds);
    } else if (data.length > 1) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 19.432608, lng: -99.133209},
            zoom: zoomMap
        });
        var bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
            latMap = data[i][1];
            lngMap = data[i][2];
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(latMap, lngMap),
                label: 'D',
                map: map//,
                //icon: markerMap
            });

            infowindow = new google.maps.InfoWindow;
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    textMarker = data[i][0];
                    infowindow.setContent(textMarker);
                    infowindow.open(map, marker);
                    map.setZoom(20);
                    map.setCenter(marker.getPosition());
                }
            }) (marker, i));
            bounds.extend(marker.getPosition());
        }
        map.fitBounds(bounds);
    }
}

//Animation marker
/*function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}*/