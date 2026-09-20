"use strict";

/* ==========================================
   ARCOVERDE BUS
========================================== */

const ARCOVERDE = [-8.4189, -37.0531];

const OSRM =
    "https://router.project-osrm.org/route/v1/driving";


/* ==========================================
   DADOS
========================================== */

const linhas = {

    escolar: {

        "ESC-01": {
            nome: "Escolar São Cristóvão",
            velocidade: 30,

            pontos: [
                {
                    nome: "São Cristóvão",
                    tipo: "bairro",
                    coords: [-8.4095, -37.0600]
                },

                {
                    nome: "Parada São Cristóvão",
                    tipo: "parada",
                    coords: [-8.4110, -37.0585]
                },

                {
                    nome: "Escola Municipal Rotary",
                    tipo: "escola",
                    coords: [-8.4128, -37.0570]
                },

                {
                    nome: "Escola Municipal Alfabeto",
                    tipo: "escola",
                    coords: [-8.4144, -37.0582]
                },

                {
                    nome: "Escola Municipal Sebastião Luiz Cavalcanti",
                    tipo: "escola",
                    coords: [-8.4160, -37.0558]
                },

                {
                    nome: "Parada Centro",
                    tipo: "parada",
                    coords: [-8.4170, -37.0555]
                }
            ]
        },


        "ESC-02": {
            nome: "Escolar Boa Vista / Centro",
            velocidade: 28,

            pontos: [
                {
                    nome: "Boa Vista",
                    tipo: "bairro",
                    coords: [-8.4070, -37.0650]
                },

                {
                    nome: "Parada Boa Vista",
                    tipo: "parada",
                    coords: [-8.4085, -37.0635]
                },

                {
                    nome: "Escola Municipal Antônio Joaquim da Silva",
                    tipo: "escola",
                    coords: [-8.4075, -37.0650]
                },

                {
                    nome: "Sucupira",
                    tipo: "bairro",
                    coords: [-8.4300, -37.0515]
                },

                {
                    nome: "Escola Municipal José Medeiros da Fonseca",
                    tipo: "escola",
                    coords: [-8.4305, -37.0510]
                },

                {
                    nome: "Centro",
                    tipo: "bairro",
                    coords: [-8.4180, -37.0540]
                },

                {
                    nome: "Escola Municipal Olga Gueiros Leite",
                    tipo: "escola",
                    coords: [-8.4173, -37.0550]
                }
            ]
        },


        "ESC-03": {
            nome: "Escolar Tamboril",
            velocidade: 27,

            pontos: [
                {
                    nome: "Centro",
                    tipo: "bairro",
                    coords: [-8.4180, -37.0540]
                },

                {
                    nome: "Parada Centro",
                    tipo: "parada",
                    coords: [-8.4170, -37.0550]
                },

                {
                    nome: "Tamboril",
                    tipo: "bairro",
                    coords: [-8.4260, -37.0465]
                },

                {
                    nome: "Escola Municipal Gumercindo Cavalcanti",
                    tipo: "escola",
                    coords: [-8.4260, -37.0460]
                },

                {
                    nome: "Escola Municipal Antônio Costa Leitão",
                    tipo: "escola",
                    coords: [-8.4245, -37.0448]
                }
            ]
        }

    },


    publico: {

        "PUB-01": {
            nome: "Centro → São Cristóvão",
            velocidade: 35,

            pontos: [
                {
                    nome: "Centro",
                    tipo: "bairro",
                    coords: [-8.4180, -37.0540]
                },

                {
                    nome: "Terminal Centro",
                    tipo: "parada",
                    coords: [-8.4170, -37.0550]
                },

                {
                    nome: "São Geraldo",
                    tipo: "bairro",
                    coords: [-8.4145, -37.0585]
                },

                {
                    nome: "Parada São Geraldo",
                    tipo: "parada",
                    coords: [-8.4140, -37.0595]
                },

                {
                    nome: "São Cristóvão",
                    tipo: "bairro",
                    coords: [-8.4095, -37.0600]
                },

                {
                    nome: "Parada São Cristóvão",
                    tipo: "parada",
                    coords: [-8.4110, -37.0585]
                }
            ]
        },


        "PUB-02": {
            nome: "Centro → Tamboril",
            velocidade: 32,

            pontos: [
                {
                    nome: "Centro",
                    tipo: "bairro",
                    coords: [-8.4180, -37.0540]
                },

                {
                    nome: "Parada Centro",
                    tipo: "parada",
                    coords: [-8.4170, -37.0550]
                },

                {
                    nome: "Tamboril",
                    tipo: "bairro",
                    coords: [-8.4260, -37.0465]
                },

                {
                    nome: "Parada Tamboril",
                    tipo: "parada",
                    coords: [-8.4250, -37.0460]
                }
            ]
        },


        "PUB-03": {
            nome: "Boa Vista → Centro → Sucupira",
            velocidade: 30,

            pontos: [
                {
                    nome: "Boa Vista",
                    tipo: "bairro",
                    coords: [-8.4070, -37.0650]
                },

                {
                    nome: "Parada Boa Vista",
                    tipo: "parada",
                    coords: [-8.4085, -37.0635]
                },

                {
                    nome: "Centro",
                    tipo: "bairro",
                    coords: [-8.4180, -37.0540]
                },

                {
                    nome: "Parada Centro",
                    tipo: "parada",
                    coords: [-8.4170, -37.0550]
                },

                {
                    nome: "Sucupira",
                    tipo: "bairro",
                    coords: [-8.4300, -37.0515]
                },

                {
                    nome: "Parada Sucupira",
                    tipo: "parada",
                    coords: [-8.4290, -37.0510]
                }
            ]
        },


        "PUB-04": {
            nome: "Centro → Boa Vista",
            velocidade: 31,

            pontos: [
                {
                    nome: "Centro",
                    tipo: "bairro",
                    coords: [-8.4180, -37.0540]
                },

                {
                    nome: "Terminal Centro",
                    tipo: "parada",
                    coords: [-8.4170, -37.0550]
                },

                {
                    nome: "Boa Vista",
                    tipo: "bairro",
                    coords: [-8.4070, -37.0650]
                },

                {
                    nome: "Parada Boa Vista",
                    tipo: "parada",
                    coords: [-8.4085, -37.0635]
                }
            ]
        }

    }

};


/* ==========================================
   VARIÁVEIS
========================================== */

let map = null;

let bus = null;

let route = null;

let markers = [];

let routePoints = [];

let positionIndex = 0;

let timer = null;

let running = true;

let currentType = "escolar";

let currentLine = null;


/* ==========================================
   INICIAR
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    init
);


function init() {

    if (
        typeof L === "undefined"
    ) {

        alert(
            "Erro: o Leaflet não foi carregado."
        );

        return;

    }


    createMap();

    createBus();

    setupEvents();

    updateLines();

}


/* ==========================================
   MAPA
========================================== */

function createMap() {

    map = L.map(
        "map"
    ).setView(
        ARCOVERDE,
        14
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

}


/* ==========================================
   ÔNIBUS
========================================== */

function createBus() {

    bus = L.marker(
        ARCOVERDE,
        {
            icon: busIcon(
                currentType
            ),
            zIndexOffset: 1000
        }
    ).addTo(map);


    bus.bindPopup(
        "<strong>🚌 Ônibus</strong><br>" +
        "Simulação acadêmica"
    );

}


function busIcon(type) {

    const color =
        type === "escolar"
            ? "#ff7900"
            : "#008cff";


    return L.divIcon({

        className: "",

        html:
            `<div class="bus-icon"
                  style="background:${color}">
                🚌
             </div>`,

        iconSize: [
            44,
            44
        ],

        iconAnchor: [
            22,
            22
        ]

    });

}


/* ==========================================
   EVENTOS
========================================== */

function setupEvents() {

    document
        .getElementById(
            "btnEscolar"
        )
        .addEventListener(
            "click",
            () => changeType("escolar")
        );


    document
        .getElementById(
            "btnPublico"
        )
        .addEventListener(
            "click",
            () => changeType("publico")
        );


    document
        .getElementById(
            "lineSelect"
        )
        .addEventListener(
            "change",
            event => {

                loadLine(
                    event.target.value
                );

            }
        );


    document
        .getElementById(
            "centerBus"
        )
        .addEventListener(
            "click",
            centerBus
        );


    document
        .getElementById(
            "fitRoute"
        )
        .addEventListener(
            "click",
            fitRoute
        );


    document
        .getElementById(
            "resetView"
        )
        .addEventListener(
            "click",
            resetMap
        );


    document
        .getElementById(
            "toggleSimulation"
        )
        .addEventListener(
            "click",
            toggleSimulation
        );


    document
        .getElementById(
            "presentationBtn"
        )
        .addEventListener(
            "click",
            () =>
                openModal(
                    "presentationModal"
                )
        );


    document
        .getElementById(
            "aboutBtn"
        )
        .addEventListener(
            "click",
            () =>
                openModal(
                    "aboutModal"
                )
        );


    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () =>
                        closeModal(
                            button.dataset.close
                        )
                );

            }
        );


    document
        .getElementById(
            "prevSlide"
        )
        .addEventListener(
            "click",
            previousSlide
        );


    document
        .getElementById(
            "nextSlide"
        )
        .addEventListener(
            "click",
            nextSlide
        );

}


/* ==========================================
   TROCAR TRANSPORTE
========================================== */

function changeType(type) {

    currentType = type;


    document
        .getElementById(
            "btnEscolar"
        )
        .classList.toggle(
            "active",
            type === "escolar"
        );


    document
        .getElementById(
            "btnPublico"
        )
        .classList.toggle(
            "active",
            type === "publico"
        );


    bus.setIcon(
        busIcon(type)
    );


    updateLines();

}


/* ==========================================
   ATUALIZAR LINHAS
========================================== */

function updateLines() {

    const select =
        document.getElementById(
            "lineSelect"
        );


    const data =
        linhas[currentType];


    select.innerHTML = "";


    Object.keys(data)
        .forEach(
            id => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value = id;

                option.textContent =
                    `${id} — ${data[id].nome}`;


                select.appendChild(
                    option
                );

            }
        );


    const first =
        Object.keys(data)[0];


    loadLine(first);

}


/* ==========================================
   CARREGAR LINHA
========================================== */

async function loadLine(id) {

    stopSimulation();

    clearMapObjects();


    currentLine =
        linhas[currentType][id];


    if (!currentLine) {

        return;

    }


    positionIndex = 0;


    updateInterface(
        id,
        currentLine
    );


    drawPoints(
        currentLine.pontos
    );


    updateList(
        currentLine.pontos
    );


    bus.setIcon(
        busIcon(currentType)
    );


    bus.setLatLng(
        currentLine.pontos[0].coords
    );


    routePoints =
        await getRoute(
            currentLine.pontos
        );


    drawRoute(
        routePoints
    );


    running = true;


    document.getElementById(
        "toggleSimulation"
    ).textContent =
        "⏸️ Pausar";


    startSimulation();

}


/* ==========================================
   ROTA OSRM
========================================== */

async function getRoute(points) {

    if (
        points.length < 2
    ) {

        return points.map(
            p => p.coords
        );

    }


    const coords =
        points
            .map(
                p =>
                    `${p.coords[1]},${p.coords[0]}`
            )
            .join(";");


    const url =
        `${OSRM}/${coords}` +
        "?overview=full&geometries=geojson";


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "OSRM HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (
            !data.routes ||
            data.routes.length === 0
        ) {

            throw new Error(
                "Nenhuma rota encontrada"
            );

        }


        return data.routes[0]
            .geometry
            .coordinates
            .map(
                c => [
                    c[1],
                    c[0]
                ]
            );

    } catch (error) {

        console.warn(
            "OSRM indisponível:",
            error
        );


        /*
         * FALLBACK
         *
         * Se o serviço de rota falhar,
         * o sistema continua funcionando.
         */

        return points.map(
            p => p.coords
        );

    }

}


/* ==========================================
   DESENHAR ROTA
========================================== */

function drawRoute(points) {

    if (!points.length) {

        return;

    }


    const color =
        currentType === "escolar"
            ? "#ff7900"
            : "#008cff";


    route =
        L.polyline(
            points,
            {
                color: color,
                weight: 6,
                opacity: .85
            }
        ).addTo(map);


    fitRoute();

}


/* ==========================================
   PONTOS
========================================== */

function drawPoints(points) {

    points.forEach(
        (point, index) => {

            const emoji =
                point.type === "escola"
                    ? "🏫"
                    : point.type === "bairro"
                        ? "🏘️"
                        : "📍";


            const marker =
                L.marker(
                    point.coords,
                    {
                        icon:
                            L.divIcon({

                                className:
                                    "",

                                html:
                                    `<div class="point-icon">
                                        ${emoji}
                                     </div>`,

                                iconSize:
                                    [28, 28],

                                iconAnchor:
                                    [14, 14]

                            })
                    }
                ).addTo(map);


            marker.bindPopup(
                `
                <strong>
                    ${emoji}
                    ${escapeHTML(point.nome)}
                </strong>
                <br>
                <small>
                    ${pointType(point.type)}
                </small>
                `
            );


            marker.on(
                "click",
                () => {

                    map.flyTo(
                        point.coords,
                        16
                    );

                }
            );


            markers.push(
                marker
            );

        }
    );

}


/* ==========================================
   LISTA
========================================== */

function updateList(points) {

    const list =
        document.getElementById(
            "stopList"
        );


    list.innerHTML = "";


    points.forEach(
        (point, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "stop-item";


            item.dataset.index =
                index;


            const emoji =
                point.type === "escola"
                    ? "🏫"
                    : point.type === "bairro"
                        ? "🏘️"
                        : "📍";


            item.innerHTML = `
                <span class="number">
                    ${index + 1}
                </span>

                <div>
                    <strong>
                        ${emoji}
                        ${escapeHTML(point.nome)}
                    </strong>

                    <small>
                        ${pointType(point.type)}
                    </small>
                </div>
            `;


            item.addEventListener(
                "click",
                () => {

                    map.flyTo(
                        point.coords,
                        16
                    );


                    markers[index]
                        ?.openPopup();

                }
            );


            list.appendChild(
                item
            );

        }
    );

}


/* ==========================================
   INTERFACE
========================================== */

function updateInterface(
    id,
    line
) {

    const escolar =
        currentType === "escolar";


    document.getElementById(
        "lineBadge"
    ).textContent = id;


    document.getElementById(
        "lineBadge"
    ).className =
        "badge " +
        (escolar
            ? "escolar"
            : "publico");


    document.getElementById(
        "routeName"
    ).textContent =
        line.nome;


    document.getElementById(
        "speed"
    ).textContent =
        line.velocidade;


    document.getElementById(
        "routeMode"
    ).textContent =
        escolar
            ? "🏫 Transporte Escolar"
            : "🚌 Transporte Público";


    document.getElementById(
        "routeMode"
    ).className =
        "mode " +
        (escolar
            ? "escolar-mode"
            : "publico-mode");


    document.getElementById(
        "overlayLineName"
    ).textContent =
        id;


    document.getElementById(
        "overlayLineType"
    ).textContent =
        escolar
            ? "🏫 Transporte Escolar"
            : "🚌 Transporte Público";


    document.getElementById(
        "pointListTitle"
    ).textContent =
        escolar
            ? "🏫 Escolas e paradas"
            : "🏘️ Bairros e paradas";


    const stops =
        line.pontos.filter(
            p =>
                p.type === "parada"
        ).length;


    const places =
        line.pontos.filter(
            p =>
                p.type !== "parada"
        ).length;


    document.getElementById(
        "totalLines"
    ).textContent =
        Object.keys(
            linhas[currentType]
        ).length;


    document.getElementById(
        "totalStops"
    ).textContent =
        stops;


    document.getElementById(
        "totalPlaces"
    ).textContent =
        places;

}


/* ==========================================
   SIMULAÇÃO
========================================== */

function startSimulation() {

    stopSimulation();


    running = true;


    function move() {

        if (!running) {

            return;

        }


        if (
            !routePoints.length
        ) {

            return;

        }


        const position =
            routePoints[
                positionIndex
            ];


        bus.setLatLng(
            position
        );


        updateBusInfo(
            position
        );


        positionIndex++;


        if (
            positionIndex >=
            routePoints.length
        ) {

            positionIndex = 0;

        }


        timer =
            setTimeout(
                move,
                100
            );

    }


    move();

}


/* ==========================================
   PARAR
========================================== */

function stopSimulation() {

    running = false;


    if (timer !== null) {

        clearTimeout(
            timer
        );

        timer = null;

    }

}


/* ==========================================
   PAUSAR
========================================== */

function toggleSimulation() {

    if (running) {

        stopSimulation();


        document.getElementById(
            "toggleSimulation"
        ).textContent =
            "▶️ Continuar";


        document.getElementById(
            "simulationLabel"
        ).textContent =
            "⏸️ Simulação pausada";

    } else {

        startSimulation();


        document.getElementById(
            "toggleSimulation"
        ).textContent =
            "⏸️ Pausar";


        document.getElementById(
            "simulationLabel"
        ).textContent =
            "🟢 Simulação ativa";

    }

}


/* ==========================================
   INFO ÔNIBUS
========================================== */

function updateBusInfo(position) {

    if (
        !currentLine
    ) {

        return;

    }


    let nearest = 0;

    let smallest =
        Infinity;


    currentLine.pontos
        .forEach(
            (point, index) => {

                const distance =
                    distanceMeters(
                        position,
                        point.coords
                    );


                if (
                    distance <
                    smallest
                ) {

                    smallest =
                        distance;

                    nearest =
                        index;

                }

            }
        );


    const point =
        currentLine.pontos[
            nearest
        ];


    document.getElementById(
        "nextStop"
    ).textContent =
        point.nome;


    document.getElementById(
        "mapNextStop"
    ).textContent =
        point.nome;


    document.getElementById(
        "stopCounter"
    ).textContent =
        `${nearest + 1}/${currentLine.pontos.length}`;


    document.getElementById(
        "distance"
    ).textContent =
        formatDistance(
            smallest
        );


    document
        .querySelectorAll(
            ".stop-item"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


    const active =
        document.querySelector(
            `.stop-item[data-index="${nearest}"]`
        );


    if (active) {

        active.classList.add(
            "active"
        );

    }

}


/* ==========================================
   DISTÂNCIA
========================================== */

function distanceMeters(
    a,
    b
) {

    const R =
        6371000;


    const lat1 =
        a[0] *
        Math.PI /
        180;


    const lat2 =
        b[0] *
        Math.PI /
        180;


    const dLat =
        (b[0] - a[0]) *
        Math.PI /
        180;


    const dLon =
        (b[1] - a[1]) *
        Math.PI /
        180;


    const x =
        Math.sin(
            dLat / 2
        ) ** 2
        +
        Math.cos(lat1)
        *
        Math.cos(lat2)
        *
        Math.sin(
            dLon / 2
        ) ** 2;


    return (
        R *
        2 *
        Math.atan2(
            Math.sqrt(x),
            Math.sqrt(1 - x)
        )
    );

}


function formatDistance(
    meters
) {

    if (
        meters < 1000
    ) {

        return (
            Math.round(meters) +
            " m"
        );

    }


    return (
        (meters / 1000)
            .toFixed(1) +
        " km"
    );

}


/* ==========================================
   MAPA
========================================== */

function centerBus() {

    if (!bus) {

        return;

    }


    map.flyTo(
        bus.getLatLng(),
        16
    );

}


function fitRoute() {

    if (!route) {

        return;

    }


    map.fitBounds(
        route.getBounds(),
        {
            padding: [
                40,
                40
            ]
        }
    );

}


function resetMap() {

    map.setView(
        ARCOVERDE,
        14
    );

}


/* ==========================================
   LIMPAR
========================================== */

function clearMapObjects() {

    if (route) {

        map.removeLayer(
            route
        );

        route = null;

    }


    markers.forEach(
        marker => {

            map.removeLayer(
                marker
            );

        }
    );


    markers = [];

}


/* ==========================================
   MODAIS
========================================== */

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("show");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");

}


/* ==========================================
   SLIDES
========================================== */

let slide = 0;


function showSlide() {

    const slides =
        document.querySelectorAll(
            ".slide"
        );


    slides.forEach(
        (item, index) => {

            item.classList.toggle(
                "active",
                index === slide
            );

        }
    );


    document.getElementById(
        "slideIndicator"
    ).textContent =
        `${slide + 1} / ${slides.length}`;

}


function nextSlide() {

    const slides =
        document.querySelectorAll(
            ".slide"
        );


    slide++;

    if (
        slide >= slides.length
    ) {

        slide = 0;

    }


    showSlide();

}


function previousSlide() {

    const slides =
        document.querySelectorAll(
            ".slide"
        );


    slide--;

    if (
        slide < 0
    ) {

        slide =
            slides.length - 1;

    }


    showSlide();

}


/* ==========================================
   TIPO DO PONTO
========================================== */

function pointType(type) {

    if (
        type === "escola"
    ) {

        return "Escola";

    }


    if (
        type === "bairro"
    ) {

        return "Bairro";

    }


    return "Parada de ônibus";

}


/* ==========================================
   SEGURANÇA HTML
========================================== */

function escapeHTML(text) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text;


    return element.innerHTML;

}


/* ==========================================
   TECLADO
========================================== */

document.addEventListener(
    "keydown",
    event => {

        const presentation =
            document.getElementById(
                "presentationModal"
            );


        if (
            presentation.classList.contains(
                "show"
            )
        ) {

            if (
                event.key ===
                "ArrowRight"
            ) {

                nextSlide();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                previousSlide();

            }

        }

    }
);
