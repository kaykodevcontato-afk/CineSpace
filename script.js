/* =====================================
   ARcoverde MOBILIDADE
   JavaScript
===================================== */


/* =====================================
   CONFIGURAÇÕES
===================================== */

// Coloque aqui o número do WhatsApp
// Exemplo: 5587999999999

const WHATSAPP = "5587999999999";


/* =====================================
   MENU
===================================== */

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {

    menu.classList.toggle("active");

});


document.querySelectorAll(".menu a").forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("active");

    });

});


/* =====================================
   MAPA
===================================== */

// Coordenadas aproximadas de Arcoverde-PE

const ARCoverde = [-8.41889, -37.05389];

const map = L.map("map").setView(ARCoverde, 14);


// OpenStreetMap

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }
).addTo(map);


// Marcador principal

const userMarker = L.marker(ARCoverde)
    .addTo(map)
    .bindPopup("📍 Arcoverde - PE")
    .openPopup();


/* =====================================
   MOTORISTAS SIMULADOS
===================================== */

const drivers = [

    [-8.418, -37.055],
    [-8.421, -37.048],
    [-8.414, -37.060],
    [-8.425, -37.052],
    [-8.410, -37.045],
    [-8.430, -37.058]

];


drivers.forEach((position, index) => {

    const driverIcon = L.divIcon({

        className: "driver-marker",

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
    .bindPopup(`Motorista disponível #${index + 1}`);

});


/* =====================================
   ELEMENTOS
===================================== */

const origem = document.getElementById("origem");
const destino = document.getElementById("destino");

const price = document.getElementById("price");
const distance = document.getElementById("distance");

const requestBtn = document.getElementById("requestBtn");
const locationBtn = document.getElementById("locationBtn");


/* =====================================
   TIPO DE VEÍCULO
===================================== */

let selectedType = "carro";

let pricePerKm = 2.50;


const rideOptions =
    document.querySelectorAll(".ride-option");


rideOptions.forEach(option => {

    option.addEventListener("click", () => {

        rideOptions.forEach(item => {

            item.classList.remove("active");

        });


        option.classList.add("active");


        selectedType =
            option.dataset.type;


        pricePerKm =
            parseFloat(option.dataset.price);


        calculatePrice();

    });

});


/* =====================================
   CALCULAR PREÇO
===================================== */

function calculatePrice() {

    // Distância simulada para demonstração

    const simulatedDistance =
        parseFloat(
            distance.textContent
                .replace(" km", "")
                .replace(",", ".")
        ) || 3.4;


    let value =
        simulatedDistance * pricePerKm;


    // Valor mínimo

    if (value < 8.50) {

        value = 8.50;

    }


    price.textContent =
        "R$ " +
        value
            .toFixed(2)
            .replace(".", ",");

}


/* =====================================
   LOCALIZAÇÃO DO USUÁRIO
===================================== */

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        alert(
            "Seu navegador não suporta localização."
        );

        return;

    }


    locationBtn.textContent =
        "📍 Obtendo localização...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            map.setView(
                [lat, lng],
                16
            );


            userMarker
                .setLatLng([lat, lng])
                .bindPopup(
                    "📍 Você está aqui"
                )
                .openPopup();


            origem.value =
                "Minha localização atual";


            locationBtn.textContent =
                "✓ Localização encontrada";


            setTimeout(() => {

                locationBtn.textContent =
                    "📍 Usar minha localização";

            }, 2500);

        },


        error => {

            console.log(error);


            alert(
                "Não foi possível acessar sua localização. Verifique a permissão do navegador."
            );


            locationBtn.textContent =
                "📍 Usar minha localização";

        }

    );

});


/* =====================================
   SOLICITAR CORRIDA
===================================== */

requestBtn.addEventListener("click", () => {

    const originValue =
        origem.value.trim();

    const destinationValue =
        destino.value.trim();


    if (!originValue) {

        alert(
            "Digite o local de partida."
        );

        origem.focus();

        return;

    }


    if (!destinationValue) {

        alert(
            "Digite o destino."
        );

        destino.focus();

        return;

    }


    const vehicle =
        selectedType === "carro"
            ? "🚗 Carro"
            : "🏍️ Moto";


    const priceValue =
        price.textContent;


    const message =

`🚗 *SOLICITAÇÃO DE CORRIDA*

📍 *Origem:*
${originValue}

🎯 *Destino:*
${destinationValue}

${vehicle}

💰 *Estimativa:*
${priceValue}

📱 Solicitação enviada pelo Arcoverde Mobilidade.`;


    const whatsappURL =
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;


    window.open(
        whatsappURL,
        "_blank"
    );

});


/* =====================================
   SEJA MOTORISTA
===================================== */

const driverBtn =
    document.getElementById("driverBtn");


driverBtn.addEventListener("click", () => {

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
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;


    window.open(
        whatsappURL,
        "_blank"
    );

});


/* =====================================
   INICIALIZAÇÃO
===================================== */

calculatePrice();

console.log(
    "🚗 Arcoverde Mobilidade iniciado!"
);
