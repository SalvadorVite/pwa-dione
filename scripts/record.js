(function() {
    var records = {
        dashPanel: document.querySelector('#dash-panel'),
        dashRecords: document.querySelector('#dash-records-user'),
        recordTemplate: document.querySelector('.recordTemplate'),
        container: document.querySelector('.main-record')
    };

    //Event listeners for UI elements record
    document.getElementById('butBackRecord').addEventListener('click', function() {
        records.dashPanel.style.display = 'block';
        records.dashRecords.style.display = 'none';
    });

    document.getElementById('butRecords').addEventListener('click', function() {
        records.dashRecords.style.display = 'block';
        records.dashPanel.style.display = 'none';
    });

    records.updateCards = function(data) {
        for (let i = 0; i < data.length; i++) {
            var card = records.recordTemplate.cloneNode(true);
            card.classList.remove('recordTemplate');
            card.classList.add('item-record');
            card.removeAttribute('hidden');
            var dateRecord = card.querySelector('.date-record');
            var priceRecord = card.querySelector('.price-record');
            var iconRecord = card.querySelector('.icon-record');
            var titleRecord = card.querySelector('.title-record');
            var textRecord = card.querySelector('.text-record');
            dateRecord.textContent = data[i].fecha_compra;
            priceRecord.textContent = '$' + data[i].total_compra;
            titleRecord.textContent = 'Zapatos ' + data[i].id_articulo;
            textRecord.textContent = data[i].nombre;
            iconRecord.classList.add('shoes-icon');
            records.container.appendChild(card);
        }
    };

    records.getDataRecords = function() {
        var url = 'https://dione.blueboy.studio/ws/Generales/obtener_historial.php';
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
                        records.updateCards(data);
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
                    records.updateCards(response);
                }
            } else {
                //Return fake data (banner, text)
                //dash.updatePromotions(data);
            }
        };

        var id_cliente = '5003';
        var dataJSON = {'id_cliente': id_cliente, 'token': '616'};
        request.open('POST', url, true);
        request.setRequestHeader('content-type', 'application/json');
        request.send(JSON.stringify(dataJSON));
    };

    records.getDataRecords();
})();