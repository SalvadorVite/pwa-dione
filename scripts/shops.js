(function() {
    var shops = {
        dataShops: [],
        dashShops: document.querySelector('#dash-shops'),
        dashPanel: document.querySelector('#dash-panel'),
    };

    //Event listeners for UI elements ViewDetail
    document.getElementById('butHomeShop').addEventListener('click', function() {
        shops.dashPanel.style.display = 'block';
        shops.dashShops.style.display = 'none';
    });

    document.getElementById('butShops').addEventListener('click', function() {
        shops.dashShops.style.display = 'block';
        shops.dashPanel.style.display = 'none';
    });

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
            arrayShops[i][0] = objectShops[i].nombre;
            arrayShops[i][1] = objectShops[i].latidud;
            arrayShops[i][2] = objectShops[i].longitud;
            arrayShops[i][3] = objectShops[i].telefono;
            arrayShops[i][4] = objectShops[i].direccion;
            arrayShops[i][5] = objectShops[i].ciudad;
            arrayShops[i][6] = objectShops[i].estado;
        }
        return arrayShops;
    };

    shops.getData();
})();

var map, marker, infowindow, markerMap = '../images/icons/icon-78x78.png';
var latMap = 20.7126691;
var lngMap = -103.4212615;
var zoomMap = 12;
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
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(latMap, lngMap),
            map: map//,
            //icon: markerMap
        });

        infowindow = new google.maps.InfoWindow;
        infowindow.setContent(textMarker);

        marker.addListener('click', function() {
            map.setZoom(18);
            map.setCenter(marker.getPosition());
            infowindow.open(map, marker);
        });
    } else if (data.length > 1) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 0, lng: 0},
            zoom: zoomMap
        });
        for (let i = 0; i < data.length; i++) {
            latMap = data[i][1];
            lngMap = data[i][2];
            textMarker = data[i][0];
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(latMap, lngMap),
                map: map//,
                //icon: markerMap
            });

            infowindow = new google.maps.InfoWindow;
            infowindow.setContent(textMarker);

            marker.addListener('click', function() {
                map.setZoom(18);
                map.setCenter(marker.getPosition());
                infowindow.open(map, marker);
            });
        }
    }
}