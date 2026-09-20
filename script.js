/*
=========================================================
 ARCOVERDE BUS
 Sistema de transporte escolar / público
 Protótipo

 Tecnologias:
 - Leaflet
 - OpenStreetMap
 - Nominatim
 - OSRM

 IMPORTANTE:
 As linhas deste arquivo são SIMULAÇÕES.
 Não representam itinerários oficiais.
=========================================================
*/


/* ======================================================
   CONFIGURAÇÃO
====================================================== */

const ARCOVERDE = [-8.4189, -37.0531];

const NOMINATIM_URL =
    "https://nominatim.openstreetmap.org/search";

const OSRM_URL =
    "https://router.project-osrm.org/route/v1/driving";


/* ======================================================
   ESCOLAS REAIS DA RELAÇÃO DA PREFEITURA
====================================================== */

const escolas = [

    {
        id: "gumercindo",
        nome: "Escola Municipal Gumercindo Cavalcanti",
        endereco: "Rua Magalhães Porto, 08, Tamboril, Arcoverde, PE"
    },

    {
        id: "antonio-costa",
        nome: "Escola Municipal Antônio Costa Leitão",
        endereco: "Rua Vicente Gomes, Tamboril, Arcoverde, PE"
    },

    {
        id: "freire",
        nome: "Escola Municipal Freire Filho",
        endereco: "Rua João Gonçalves de Lima, 145, São Geraldo, Arcoverde, PE"
    },

    {
        id: "jose-medeiros",
        nome: "Escola Municipal José Medeiros da Fonseca",
        endereco: "Rua José Ferreira de Lima, S/N, Sucupira, Arcoverde, PE"
    },

    {
        id: "euclides",
        nome: "Escola Municipal Euclides da Cunha",
        endereco: "Rua Leonardo José Guimarães, S/N, Centro, Arcoverde, PE"
    },

    {
        id: "olga",
        nome: "Escola Municipal Olga Gueiros Leite",
        endereco: "Rua Joaquim Bezerra, S/N, Centro, Arcoverde, PE"
    },

    {
        id: "barao",
        nome: "Escola Municipal Barão do Rio Branco",
        endereco: "Rua Serafim de Brito, Centro, Arcoverde, PE"
    },

    {
        id: "joao-batista",
        nome: "Escola Municipal João Batista Cruz Barros",
        endereco: "Rua Manoel Bezerra, S/N, Cidade Jardim, Arcoverde, PE"
    },

    {
        id: "ivany",
        nome: "CEI Ivany Rodrigues Bradley",
        endereco: "Rua Dr. Manoel Borba, S/N, Tamboril, Arcoverde, PE"
    },

    {
        id: "rotary",
        nome: "Escola Municipal Rotary",
        endereco: "Rua Teixeira de Freitas, 319, São Cristóvão, Arcoverde, PE"
    },

    {
        id: "alfabeto",
        nome: "Escola Municipal Alfabeto",
        endereco: "Rua Gumercindo Cavalcanti, S/N, São Cristóvão, Arcoverde, PE"
    },

    {
        id: "sebastiao",
        nome: "Escola Municipal Sebastião Luiz Cavalcanti",
        endereco: "Rua Corália de Siqueira, 120, São Cristóvão, Arcoverde, PE"
    },

    {
        id: "adalgiza",
        nome: "Escola Municipal Adalgiza Cavalcanti de Barros Correia",
        endereco: "Rua José Lopes, S/N, Vila São Francisco, Arcoverde, PE"
    },

    {
        id: "antonio-joaquim",
        nome: "Escola Municipal Antônio Joaquim da Silva",
        endereco: "Rua James Pacheco, Boa Vista, Arcoverde, PE"
    }

];


/* ======================================================
   LINHAS DE SIMULAÇÃO
====================================================== */

const linhas = {

    "ESC-01": {

        nome: "Escolar São Cristóvão",

        tipo: "escolar",

        velocidade: 32,

        paradas: [

            {
                tipo: "bairro",
                nome: "São Cristóvão",
                busca: "São Cristóvão, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escolaId: "rotary"
            },

            {
                tipo: "escola",
                escolaId: "alfabeto"
            },

            {
                tipo: "escola",
                escolaId: "sebastiao"
            },

            {
                tipo: "bairro",
                nome: "Centro",
                busca: "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escolaId: "olga"
            },

            {
                tipo: "escola",
                escolaId: "barao"
            }

        ]

    },


    "ESC-02": {

        nome: "Escolar Centro",

        tipo: "escolar",

        velocidade: 30,

        paradas: [

            {
                tipo: "bairro",
                nome: "Boa Vista",
                busca: "Boa Vista, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escolaId: "antonio-joaquim"
            },

            {
                tipo: "bairro",
                nome: "Sucupira",
                busca: "Sucupira, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escolaId: "jose-medeiros"
            },

            {
                tipo: "bairro",
                nome: "Centro",
                busca: "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escolaId: "euclides"
            },

            {
                tipo: "bairro",
                nome: "Tamboril",
                busca: "Tamboril, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escolaId: "gumercindo"
            }

        ]

    }

};


/* ======================================================
   VARIÁVEIS
====================================================== */

let mapa;

let rotaLayer = null;

let busMarker = null;

let stopMarkers = [];

let routeCoordinates = [];

let animationFrame = null;

let animationIndex = 0;

let simulationRunning = true;

let currentLine = "ESC-01";

let routeReady = false;


/* ======================================================
   INICIAR MAPA
====================================================== */

function iniciarMapa() {

    mapa = L.map("map", {

        zoomControl: true,

        preferCanvas: true

    }).setView(ARCOVERDE, 13);


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(mapa);


    criarIconeOnibus();

}


/* ======================================================
   ÍCONE DO ÔNIBUS
====================================================== */

function criarIconeOnibus() {

    const busIcon = L.divIcon({

        className: "",

        html:
            '<div class="bus-marker">🚌</div>',

        iconSize: [42, 42],

        iconAnchor: [21, 21],

        popupAnchor: [0, -22]

    });


    busMarker = L.marker(

        ARCOVERDE,

        {
            icon: busIcon,

            zIndexOffset: 1000
        }

    ).addTo(mapa);


    busMarker.bindPopup(`
        <div class="popup-title">
            🚌 ESC-01
        </div>

        <div class="popup-subtitle">
            Ônibus escolar em simulação
        </div>
    `);

}


/* ======================================================
   GEOCODIFICAÇÃO
====================================================== */

async function geocodificar(endereco) {

    const params = new URLSearchParams({

        q: endereco,

        format: "json",

        limit: "1",

        countrycodes: "br",

        addressdetails: "1"

    });


    try {

        const response = await fetch(
            `${NOMINATIM_URL}?${params.toString()}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Falha na geocodificação"
            );

        }


        const data = await response.json();


        if (!data.length) {

            console.warn(
                "Local não encontrado:",
                endereco
            );

            return null;

        }


        return [

            Number(data[0].lat),

            Number(data[0].lon)

        ];

    }

    catch (error) {

        console.error(
            "Erro Nominatim:",
            error
        );

        return null;

    }

}


/* ======================================================
   PREPARAR PARADAS
====================================================== */

async function prepararParadas(lineId) {

    const linha = linhas[lineId];

    const resultado = [];


    for (const parada of linha.paradas) {

        let nome = parada.nome;

        let endereco = parada.busca;

        let coordenadas = null;


        if (parada.tipo === "escola") {

            const escola = escolas.find(
                item =>
                    item.id === parada.escolaId
            );


            if (!escola) {
                continue;
            }


            nome = escola.nome;

            endereco = escola.endereco;

        }


        coordenadas =
            await geocodificar(endereco);


        if (!coordenadas) {

            console.warn(
                "Não foi possível localizar:",
                nome
            );

            continue;

        }


        resultado.push({

            nome,

            tipo: parada.tipo,

            coordenadas,

            endereco

        });


        /*
        Nominatim deve ser utilizado
        com intervalo entre requisições.
        */

        await esperar(1100);

    }


    return resultado;

}


/* ======================================================
   ROTA OSRM
====================================================== */

async function calcularRota(paradas) {

    if (paradas.length < 2) {

        throw new Error(
            "São necessárias pelo menos duas paradas."
        );

    }


    const coordenadas = paradas
        .map(
            parada =>
                `${parada.coordenadas[1]},${parada.coordenadas[0]}`
        )
        .join(";");


    const url =
        `${OSRM_URL}/${coordenadas}` +
        "?overview=full" +
        "&geometries=geojson";


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Erro ao calcular rota."
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
            "A rota não pôde ser calculada."
        );

    }


    return data.routes[0];

}


/* ======================================================
   DESENHAR PARADAS
====================================================== */

function desenharParadas(paradas) {

    stopMarkers.forEach(
        marker =>
            mapa.removeLayer(marker)
    );


    stopMarkers = [];


    paradas.forEach(
        (parada, index) => {

            const icon = L.divIcon({

                className: "",

                html: `
                    <div style="
                        width:28px;
                        height:28px;
                        border-radius:50%;
                        background:#0b1726;
                        border:3px solid ${
                            parada.tipo === "escola"
                                ? "#facc15"
                                : "#168cff"
                        };
                        display:grid;
                        place-items:center;
                        font-size:13px;
                    ">
                        ${
                            parada.tipo === "escola"
                                ? "🏫"
                                : "📍"
                        }
                    </div>
                `,

                iconSize: [28, 28],

                iconAnchor: [14, 14]

            });


            const marker =
                L.marker(
                    parada.coordenadas,
                    {
                        icon
                    }
                ).addTo(mapa);


            marker.bindPopup(`
                <div class="popup-title">
                    ${
                        parada.tipo === "escola"
                            ? "🏫"
                            : "📍"
                    }
                    ${escaparHTML(parada.nome)}
                </div>

                <div class="popup-subtitle">
                    ${
                        parada.tipo === "escola"
                            ? "Escola"
                            : "Parada / bairro"
                    }
                </div>
            `);


            stopMarkers.push(marker);

        }
    );

}


/* ======================================================
   DESENHAR ROTA
====================================================== */

function desenharRota(route) {

    if (rotaLayer) {

        mapa.removeLayer(
            rotaLayer
        );

    }


    const latlngs =
        route.geometry.coordinates.map(
            coord => [
                coord[1],
                coord[0]
            ]
        );


    routeCoordinates =
        latlngs;


    rotaLayer =
        L.polyline(

            latlngs,

            {
                color: "#168cff",

                weight: 6,

                opacity: .9,

                lineJoin: "round"
            }

        ).addTo(mapa);


    mapa.fitBounds(
        rotaLayer.getBounds(),
        {
            padding: [40, 40]
        }
    );


    routeReady = true;

}


/* ======================================================
   ATUALIZAR LISTA
====================================================== */

function atualizarLista(paradas) {

    const container =
        document.getElementById(
            "stopList"
        );


    container.innerHTML = "";


    paradas.forEach(
        (parada, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "stop-item";


            div.dataset.index =
                index;


            div.innerHTML = `

                <div class="stop-icon">
                    ${
                        parada.tipo === "escola"
                            ? "🏫"
                            : "📍"
                    }
                </div>

                <div>

                    <div class="stop-name">
                        ${escaparHTML(parada.nome)}
                    </div>

                    <span class="stop-type">
                        ${
                            parada.tipo === "escola"
                                ? "Escola"
                                : "Parada"
                        }
                    </span>

                </div>

                <div class="stop-state">
                    🔵
                </div>

            `;


            container.appendChild(
                div
            );

        }
    );

}


/* ======================================================
   ESTADO DAS PARADAS
====================================================== */

function atualizarEstadoParadas(
    paradas,
    indiceAtual
) {

    const itens =
        document.querySelectorAll(
            ".stop-item"
        );


    itens.forEach(
        (item, index) => {

            item.classList.remove(
                "next",
                "passed"
            );


            const estado =
                item.querySelector(
                    ".stop-state"
                );


            if (
                index <
                indiceAtual
            ) {

                item.classList.add(
                    "passed"
                );

                estado.textContent =
                    "✓";

            }

            else if (
                index ===
                indiceAtual
            ) {

                item.classList.add(
                    "next"
                );

                estado.textContent =
                    "🟢";

            }

            else {

                estado.textContent =
                    "🔵";

            }

        }
    );


    const proxima =
        paradas[indiceAtual];


    if (proxima) {

        document.getElementById(
            "nextStop"
        ).textContent =
            proxima.nome;

    }


    document.getElementById(
        "stopCounter"
    ).textContent =
        `${Math.min(
            indiceAtual,
            paradas.length
        )} / ${paradas.length}`;

}


/* ======================================================
   ENCONTRAR PONTO MAIS PRÓXIMO
====================================================== */

function encontrarIndiceRota(
    coordenadas
) {

    if (!routeCoordinates.length) {
        return 0;
    }


    let menorDistancia =
        Infinity;

    let indice = 0;


    routeCoordinates.forEach(
        (ponto, i) => {

            const distancia =
                distanciaMetros(
                    coordenadas,
                    ponto
                );


            if (
                distancia <
                menorDistancia
            ) {

                menorDistancia =
                    distancia;

                indice = i;

            }

        }
    );


    return indice;

}


/* ======================================================
   ANIMAÇÃO DO ÔNIBUS
====================================================== */

function iniciarAnimacao(paradas) {

    if (!routeCoordinates.length) {
        return;
    }


    animationIndex = 0;


    function animar() {

        if (
            !simulationRunning
        ) {

            animationFrame =
                requestAnimationFrame(
                    animar
                );

            return;

        }


        if (
            animationIndex >=
            routeCoordinates.length
        ) {

            animationIndex = 0;

        }


        const posicao =
            routeCoordinates[
                Math.floor(
                    animationIndex
                )
            ];


        busMarker.setLatLng(
            posicao
        );


        const indiceParada =
            encontrarParadaMaisProxima(
                posicao,
                paradas
            );


        atualizarEstadoParadas(
            paradas,
            indiceParada
        );


        atualizarDistancia(
            posicao,
            paradas,
            indiceParada
        );


        animationIndex += .45;


        animationFrame =
            requestAnimationFrame(
                animar
            );

    }


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    animationFrame =
        requestAnimationFrame(
            animar
        );

}


/* ======================================================
   PARADA MAIS PRÓXIMA
====================================================== */

function encontrarParadaMaisProxima(
    posicao,
    paradas
) {

    let menor =
        Infinity;

    let indice =
        0;


    paradas.forEach(
        (parada, index) => {

            const distancia =
                distanciaMetros(
                    posicao,
                    parada.coordenadas
                );


            if (
                distancia <
                menor
            ) {

                menor =
                    distancia;

                indice =
                    index;

            }

        }
    );


    return indice;

}


/* ======================================================
   DISTÂNCIA
====================================================== */

function atualizarDistancia(
    posicao,
    paradas,
    indice
) {

    if (!paradas[indice]) {
        return;
    }


    const distancia =
        distanciaMetros(
            posicao,
            paradas[indice]
                .coordenadas
        );


    document.getElementById(
        "distance"
    ).textContent =
        formatarDistancia(
            distancia
        );

}


/* ======================================================
   HAVERSINE
====================================================== */

function distanciaMetros(
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


    const deltaLat =
        (b[0] - a[0]) *
        Math.PI /
        180;


    const deltaLon =
        (b[1] - a[1]) *
        Math.PI /
        180;


    const x =
        Math.sin(
            deltaLat / 2
        ) ** 2;


    const y =
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(
            deltaLon / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(
                x + y
            ),
            Math.sqrt(
                1 - x - y
            )
        );


    return R * c;

}


/* ======================================================
   FORMATAR DISTÂNCIA
====================================================== */

function formatarDistancia(
    metros
) {

    if (
        !Number.isFinite(
            metros
        )
    ) {

        return "--";

    }


    if (
        metros < 1000
    ) {

        return `${Math.round(metros)} m`;

    }


    return `${(
        metros / 1000
    ).toFixed(1)} km`;

}


/* ======================================================
   TROCAR LINHA
====================================================== */

async function carregarLinha(
    lineId
) {

    currentLine =
        lineId;

    routeReady =
        false;


    const linha =
        linhas[lineId];


    document.getElementById(
        "routeName"
    ).textContent =
        `Linha ${lineId} — ${linha.nome}`;


    document.getElementById(
        "speed"
    ).textContent =
        `${linha.velocidade} km/h`;


    document.getElementById(
        "stopList"
    ).textContent =
        "Localizando escolas e paradas...";


    try {

        const paradas =
            await prepararParadas(
                lineId
            );


        if (
            paradas.length < 2
        ) {

            throw new Error(
                "Não existem pontos suficientes para criar a rota."
            );

        }


        atualizarLista(
            paradas
        );


        desenharParadas(
            paradas
        );


        const route =
            await calcularRota(
                paradas
            );


        desenharRota(
            route
        );


        iniciarAnimacao(
            paradas
        );


    }

    catch (error) {

        console.error(
            error
        );


        document.getElementById(
            "stopList"
        ).innerHTML = `

            <div style="
                color:#fca5a5;
                font-size:12px;
                line-height:1.5;
            ">

                Não foi possível montar
                a rota automaticamente.

                <br><br>

                Verifique sua conexão
                com a internet e tente
                novamente.

            </div>

        `;

    }

}


/* ======================================================
   BOTÕES
====================================================== */

function configurarBotoes() {

    document
        .getElementById(
            "lineSelect"
        )
        .addEventListener(
            "change",
            event => {

                carregarLinha(
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
            () => {

                if (
                    busMarker
                ) {

                    mapa.setView(
                        busMarker.getLatLng(),
                        16
                    );

                    busMarker.openPopup();

                }

            }
        );


    document
        .getElementById(
            "fitRoute"
        )
        .addEventListener(
            "click",
            () => {

                if (
                    rotaLayer
                ) {

                    mapa.fitBounds(
                        rotaLayer.getBounds(),
                        {
                            padding:
                                [40, 40]
                        }
                    );

                }

            }
        );


    document
        .getElementById(
            "toggleSimulation"
        )
        .addEventListener(
            "click",
            event => {

                simulationRunning =
                    !simulationRunning;


                event.target.textContent =
                    simulationRunning
                        ? "⏸ Pausar simulação"
                        : "▶ Continuar simulação";

            }
        );

}


/* ======================================================
   UTILITÁRIOS
====================================================== */

function esperar(
    ms
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


function escaparHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto;

    return div.innerHTML;

}


/* ======================================================
   INICIALIZAÇÃO
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        iniciarMapa();

        configurarBotoes();

        await carregarLinha(
            "ESC-01"
        );

    }
);
