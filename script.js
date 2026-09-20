/* ==================================================
   ARCOVERDE MOBILIDADE
   ROTA REAL + CÁLCULO DE PREÇO
================================================== */


/* ==================================================
   CONFIGURAÇÕES
================================================== */

const WHATSAPP = "5587999999999";


// Tarifas

const TARIFAS = {

    carro: {
        bandeirada: 5.00,
        porKm: 2.50,
        minimo: 8.50
    },

    moto: {
        bandeirada: 4.00,
        porKm: 1.80,
        minimo: 7.00
    }

};


/*
   Nominatim:
   transforma endereço em coordenadas.

   OSRM:
   calcula a rota real pelas ruas.
*/

const GEOCODING_URL =
    "https://nominatim.openstreetmap.org/search";

const ROUTING_URL =
    "https://router.project-osrm.org/route/v1/driving";


/* ==================================================
   ELEMENTOS
================================================== */

const menuBtn =
    document.getElementById("menuBtn");

const menu =
    document.getElementById("menu");

const origem =
    document.getElementById("origem");

const destino =
    document.getElementById("destino");

const distance =
    document.getElementById("distance");

const duration =
    document.getElementById("duration");

const price =
    document.getElementById("price");

const calculateBtn =
    document.getElementById("calculateBtn");

const requestBtn =
    document.getElementById("requestBtn");

const locationBtn =
    document.getElementById("locationBtn");

const driverBtn =
    document.getElementById("driverBtn");


/* ==================================================
   VARIÁVEIS
================================================== */

let selectedType = "carro";

let pricePerKm = 2.50;

let currentRoute = null;

let currentDistanceKm = null;

let currentDurationMin = null;

let currentPrice = null;

let originCoordinates = null;

let destinationCoordinates = null;


/* ==================================================
   MENU
================================================== */

menuBtn.addEventListener("click", () => {

    menu.classList.toggle("active");

});


document.querySelectorAll(".menu a").forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("active");

    });

});


/* ==================================================
   MAPA
================================================== */

const ARCOVERDE = [
    -8.41889,
    -37.05389
];


const map = L.map("map").setView(
    ARCOVERDE,
    14
);


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,

        attribution:
            '&copy; OpenStreetMap contributors'
    }
).addTo(map);


/* ==================================================
   MARCADOR DO USUÁRIO
================================================== */

let userMarker =
    L.marker(ARCOVERDE)
        .addTo(map)
        .bindPopup(
            "📍 Arcoverde - PE"
        );


/* ==================================================
   MOTORISTAS SIMULADOS
================================================== */

const drivers = [

    [-8.418, -37.055],

    [-8.421, -37.048],

    [-8.414, -37.060],

    [-8.425, -37.052],

    [-8.410, -37.045],

    [-8.430, -37.058]

];


drivers.forEach((position, index) => {

    const driverIcon =
        L.divIcon({

            className:
                "driver-marker",

            html: `
                <div style="
                    background:#111827;
                    color:white;
                    width:34px;
                    height:34px;
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    border:3px solid white;
                    box-shadow:0 3px 10px rgba(0,0,0,.3);
                    font-size:17px;
                ">
                    🚗
                </div>
            `,

            iconSize: [34, 34],

            iconAnchor: [17, 17]

        });


    L.marker(position, {
        icon: driverIcon
    })
    .addTo(map)
    .bindPopup(
        `Motorista disponível #${index + 1}`
    );

});


/* ==================================================
   SELEÇÃO CARRO / MOTO
================================================== */

document
    .querySelectorAll(".ride-option")
    .forEach(option => {

        option.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".ride-option")
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                option.classList.add(
                    "active"
                );


                selectedType =
                    option.dataset.type;


                pricePerKm =
                    parseFloat(
                        option.dataset.price
                    );


                if (currentDistanceKm) {

                    updatePrice();

                }

            }
        );

    });


/* ==================================================
   FORMATAR DINHEIRO
================================================== */

function formatMoney(value) {

    return value.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* ==================================================
   FORMATAR DISTÂNCIA
================================================== */

function formatDistance(km) {

    if (km < 1) {

        return Math.round(
            km * 1000
        ) + " m";

    }


    return km
        .toFixed(2)
        .replace(".", ",")
        + " km";

}


/* ==================================================
   FORMATAR TEMPO
================================================== */

function formatDuration(minutes) {

    const rounded =
        Math.round(minutes);


    if (rounded < 1) {

        return "< 1 min";

    }


    if (rounded < 60) {

        return rounded + " min";

    }


    const hours =
        Math.floor(
            rounded / 60
        );


    const mins =
        rounded % 60;


    if (mins === 0) {

        return hours + " h";

    }


    return `${hours} h ${mins} min`;

}


/* ==================================================
   GEOCODIFICAR ENDEREÇO
================================================== */

async function geocodeAddress(address) {

    const query =
        `${address}, Arcoverde, Pernambuco, Brasil`;


    const params =
        new URLSearchParams({

            q: query,

            format: "json",

            limit: "1",

            countrycodes: "br",

            addressdetails: "1"

        });


    const response =
        await fetch(
            `${GEOCODING_URL}?${params.toString()}`,
            {
                headers: {
                    "Accept":
                        "application/json"
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            "Erro ao consultar endereço."
        );

    }


    const results =
        await response.json();


    if (!results.length) {

        throw new Error(
            `Endereço não encontrado: ${address}`
        );

    }


    return {

        lat:
            parseFloat(
                results[0].lat
            ),

        lon:
            parseFloat(
                results[0].lon
            ),

        display:
            results[0].display_name

    };

}


/* ==================================================
   CALCULAR ROTA
================================================== */

async function calculateRoute(
    origin,
    destination
) {

    const coordinates =

        `${origin.lon},${origin.lat};` +
        `${destination.lon},${destination.lat}`;


    const url =

        `${ROUTING_URL}/${coordinates}` +
        `?overview=full` +
        `&geometries=geojson`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Não foi possível calcular a rota."
        );

    }


    const data =
        await response.json();


    if (
        data.code !== "Ok" ||
        !data.routes ||
        !data.routes.length
    ) {

        throw new Error(
            "Não foi encontrada uma rota entre os locais."
        );

    }


    return data.routes[0];

}


/* ==================================================
   ATUALIZAR PREÇO
================================================== */

function updatePrice() {

    if (
        currentDistanceKm === null
    ) {
        return;
    }


    const tarifa =
        TARIFAS[selectedType];


    const calculated =
        tarifa.bandeirada +
        (
            currentDistanceKm *
            tarifa.porKm
        );


    const finalPrice =
        Math.max(
            calculated,
            tarifa.minimo
        );


    /*
       Arredonda para centavos.
    */

    currentPrice =
        Math.round(
            finalPrice * 100
        ) / 100;


    price.textContent =
        formatMoney(
            currentPrice
        );

}


/* ==================================================
   DESENHAR ROTA
================================================== */

function drawRoute(route) {

    if (currentRoute) {

        map.removeLayer(
            currentRoute
        );

    }


    currentRoute =
        L.geoJSON(
            route.geometry,
            {

                style: {

                    color: "#111827",

                    weight: 6,

                    opacity: 0.85

                }

            }
        ).addTo(map);


    map.fitBounds(
        currentRoute.getBounds(),
        {
            padding: [40, 40]
        }
    );

}


/* ==================================================
   CALCULAR CORRIDA
================================================== */

calculateBtn.addEventListener(
    "click",
    async () => {

        const originText =
            origem.value.trim();

        const destinationText =
            destino.value.trim();


        if (!originText) {

            alert(
                "Digite o local de partida."
            );

            origem.focus();

            return;

        }


        if (!destinationText) {

            alert(
                "Digite o destino."
            );

            destino.focus();

            return;

        }


        calculateBtn.disabled =
            true;

        requestBtn.disabled =
            true;


        calculateBtn.textContent =
            "🧭 CALCULANDO ROTA...";


        try {

            /*
                1. Encontrar origem
            */

            const origin =
                originCoordinates ||
                await geocodeAddress(
                    originText
                );


            /*
                2. Encontrar destino
            */

            const destination =
                await geocodeAddress(
                    destinationText
                );


            /*
                3. Calcular rota
            */

            const route =
                await calculateRoute(
                    origin,
                    destination
                );


            /*
                4. Distância real
            */

            currentDistanceKm =
                route.distance / 1000;


            /*
                5. Tempo real estimado
            */

            currentDurationMin =
                route.duration / 60;


            /*
                6. Atualizar interface
            */

            distance.textContent =
                formatDistance(
                    currentDistanceKm
                );


            duration.textContent =
                formatDuration(
                    currentDurationMin
                );


            /*
                7. Calcular preço
            */

            updatePrice();


            /*
                8. Desenhar rota
            */

            drawRoute(route);


            /*
                9. Criar marcadores
            */

            L.marker([
                origin.lat,
                origin.lon
            ])
            .addTo(map)
            .bindPopup(
                "🟢 Origem"
            );


            L.marker([
                destination.lat,
                destination.lon
            ])
            .addTo(map)
            .bindPopup(
                "🔴 Destino"
            );


            /*
                Guardar coordenadas
            */

            originCoordinates =
                origin;

            destinationCoordinates =
                destination;


            requestBtn.disabled =
                false;


        } catch (error) {

            console.error(error);


            alert(
                error.message ||
                "Não foi possível calcular a corrida."
            );


            distance.textContent =
                "—";


            duration.textContent =
                "—";


            price.textContent =
                "—";


            currentDistanceKm =
                null;

        } finally {

            calculateBtn.disabled =
                false;


            calculateBtn.textContent =
                "🧭 CALCULAR CORRIDA";

        }

    }
);


/* ==================================================
   LOCALIZAÇÃO DO USUÁRIO
================================================== */

locationBtn.addEventListener(
    "click",
    () => {

        if (!navigator.geolocation) {

            alert(
                "Seu navegador não suporta localização."
            );

            return;

        }


        locationBtn.disabled =
            true;


        locationBtn.textContent =
            "📍 Obtendo localização...";


        navigator.geolocation.getCurrentPosition(

            position => {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;


                originCoordinates = {

                    lat: lat,

                    lon: lon,

                    display:
                        "Minha localização"

                };


                map.setView(
                    [lat, lon],
                    16
                );


                userMarker
                    .setLatLng([
                        lat,
                        lon
                    ])
                    .bindPopup(
                        "📍 Você está aqui"
                    )
                    .openPopup();


                origem.value =
                    "Minha localização atual";


                locationBtn.textContent =
                    "✓ Localização definida";


                setTimeout(() => {

                    locationBtn.textContent =
                        "📍 Usar minha localização como origem";

                    locationBtn.disabled =
                        false;

                }, 2000);

            },


            error => {

                console.error(error);


                alert(
                    "Não foi possível acessar sua localização. Permita o acesso no navegador."
                );


                locationBtn.disabled =
                    false;


                locationBtn.textContent =
                    "📍 Usar minha localização como origem";

            },

            {

                enableHighAccuracy:
                    true,

                timeout:
                    10000,

                maximumAge:
                    30000

            }

        );

    }
);


/* ==================================================
   SOLICITAR CORRIDA
================================================== */

requestBtn.addEventListener(
    "click",
    () => {

        if (!currentDistanceKm) {

            alert(
                "Calcule a rota primeiro."
            );

            return;

        }


        const originText =
            origem.value.trim();

        const destinationText =
            destino.value.trim();


        const vehicle =
            selectedType === "carro"
                ? "🚗 Carro"
                : "🏍️ Moto";


        const message =

`🚗 *SOLICITAÇÃO DE CORRIDA*

📍 *Origem:*
${originText}

🎯 *Destino:*
${destinationText}

${vehicle}

📏 *Distância:*
${formatDistance(currentDistanceKm)}

⏱️ *Tempo estimado:*
${formatDuration(currentDurationMin)}

💰 *Estimativa:*
${formatMoney(currentPrice)}

📱 Solicitação enviada pelo Arcoverde Mobilidade.`;


        const whatsappURL =

            `https://wa.me/${WHATSAPP}` +
            `?text=${encodeURIComponent(message)}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);


/* ==================================================
   SEJA MOTORISTA
================================================== */

driverBtn.addEventListener(
    "click",
    () => {

        const message =

`👨‍✈️ *QUERO SER MOTORISTA*

Olá! Tenho interesse em trabalhar como motorista no Arcoverde Mobilidade.

Nome:
Telefone:
Tipo de veículo:
Modelo:
Ano:
CNH:`;


        const whatsappURL =

            `https://wa.me/${WHATSAPP}` +
            `?text=${encodeURIComponent(message)}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);


/* ==================================================
   INICIALIZAÇÃO
================================================== */

console.log(
    "🚗 Arcoverde Mobilidade iniciado."
);

console.log(
    "🗺️ Roteamento: OSRM"
);

console.log(
    "📍 Geocodificação: Nominatim"
);
