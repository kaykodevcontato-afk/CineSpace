/*
=========================================================
 ARCOVERDE BUS

 DOIS SISTEMAS:

 1. TRANSPORTE ESCOLAR
    - Escolas
    - Paradas escolares
    - Rotas escolares

 2. TRANSPORTE PÚBLICO
    - Bairros
    - Paradas de ônibus
    - Rotas públicas

 As rotas são SIMULAÇÕES.
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
   ESCOLAS
====================================================== */

const escolas = {

    rotary: {
        nome: "Escola Municipal Rotary",
        endereco:
            "Rua Teixeira de Freitas, 319, São Cristóvão, Arcoverde, PE"
    },

    alfabeto: {
        nome: "Escola Municipal Alfabeto",
        endereco:
            "Rua Gumercindo Cavalcanti, São Cristóvão, Arcoverde, PE"
    },

    sebastiao: {
        nome:
            "Escola Municipal Sebastião Luiz Cavalcanti",
        endereco:
            "Rua Corália de Siqueira, 120, São Cristóvão, Arcoverde, PE"
    },

    gumercindo: {
        nome:
            "Escola Municipal Gumercindo Cavalcanti",
        endereco:
            "Rua Magalhães Porto, Tamboril, Arcoverde, PE"
    },

    antonioCosta: {
        nome:
            "Escola Municipal Antônio Costa Leitão",
        endereco:
            "Tamboril, Arcoverde, PE"
    },

    joseMedeiros: {
        nome:
            "Escola Municipal José Medeiros da Fonseca",
        endereco:
            "Sucupira, Arcoverde, PE"
    },

    antonioJoaquim: {
        nome:
            "Escola Municipal Antônio Joaquim da Silva",
        endereco:
            "Boa Vista, Arcoverde, PE"
    },

    olga: {
        nome:
            "Escola Municipal Olga Gueiros Leite",
        endereco:
            "Centro, Arcoverde, PE"
    },

    barao: {
        nome:
            "Escola Municipal Barão do Rio Branco",
        endereco:
            "Centro, Arcoverde, PE"
    }

};


/* ======================================================
   ROTAS ESCOLARES
====================================================== */

const linhasEscolares = {

    "ESC-01": {

        nome:
            "Escolar São Cristóvão",

        velocidade:
            30,

        pontos: [

            {
                tipo: "bairro",
                nome: "São Cristóvão",
                busca:
                    "São Cristóvão, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada São Cristóvão",
                busca:
                    "São Cristóvão, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escola:
                    "rotary"
            },

            {
                tipo: "escola",
                escola:
                    "alfabeto"
            },

            {
                tipo: "escola",
                escola:
                    "sebastiao"
            },

            {
                tipo: "parada",
                nome:
                    "Parada Centro",
                busca:
                    "Centro, Arcoverde, Pernambuco"
            }

        ]

    },


    "ESC-02": {

        nome:
            "Escolar Boa Vista / Centro",

        velocidade:
            28,

        pontos: [

            {
                tipo: "bairro",
                nome:
                    "Boa Vista",
                busca:
                    "Boa Vista, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada Boa Vista",
                busca:
                    "Boa Vista, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escola:
                    "antonioJoaquim"
            },

            {
                tipo: "bairro",
                nome:
                    "Sucupira",
                busca:
                    "Sucupira, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escola:
                    "joseMedeiros"
            },

            {
                tipo: "bairro",
                nome:
                    "Centro",
                busca:
                    "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "escola",
                escola:
                    "olga"
            }

        ]

    }

};


/* ======================================================
   ROTAS TRANSPORTE PÚBLICO
====================================================== */

const linhasPublicas = {

    "PUB-01": {

        nome:
            "Centro → São Cristóvão",

        velocidade:
            35,

        pontos: [

            {
                tipo: "bairro",
                nome:
                    "Centro",
                busca:
                    "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada Terminal Centro",
                busca:
                    "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "bairro",
                nome:
                    "São Geraldo",
                busca:
                    "São Geraldo, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada São Geraldo",
                busca:
                    "São Geraldo, Arcoverde, Pernambuco"
            },

            {
                tipo: "bairro",
                nome:
                    "São Cristóvão",
                busca:
                    "São Cristóvão, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada São Cristóvão",
                busca:
                    "São Cristóvão, Arcoverde, Pernambuco"
            }

        ]

    },


    "PUB-02": {

        nome:
            "Centro → Tamboril",

        velocidade:
            32,

        pontos: [

            {
                tipo: "bairro",
                nome:
                    "Centro",
                busca:
                    "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada Centro",
                busca:
                    "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "bairro",
                nome:
                    "Tamboril",
                busca:
                    "Tamboril, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada Tamboril",
                busca:
                    "Tamboril, Arcoverde, Pernambuco"
            }

        ]

    },


    "PUB-03": {

        nome:
            "Boa Vista → Centro → Sucupira",

        velocidade:
            30,

        pontos: [

            {
                tipo: "bairro",
                nome:
                    "Boa Vista",
                busca:
                    "Boa Vista, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada Boa Vista",
                busca:
                    "Boa Vista, Arcoverde, Pernambuco"
            },

            {
                tipo: "bairro",
                nome:
                    "Centro",
                busca:
                    "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada Centro",
                busca:
                    "Centro, Arcoverde, Pernambuco"
            },

            {
                tipo: "bairro",
                nome:
                    "Sucupira",
                busca:
                    "Sucupira, Arcoverde, Pernambuco"
            },

            {
                tipo: "parada",
                nome:
                    "Parada Sucupira",
                busca:
                    "Sucupira, Arcoverde, Pernambuco"
            }

        ]

    }

};


/* ======================================================
   ESTADO
====================================================== */

let mapa;

let rotaLayer = null;

let busMarker = null;

let stopMarkers = [];

let routeCoordinates = [];

let animationFrame = null;

let animationIndex = 0;

let simulationRunning = true;

let tipoAtual = "escolar";

let linhaAtual = "ESC-01";

let pontosAtuais = [];


/* ======================================================
   MAPA
====================================================== */

function iniciarMapa() {

    mapa =
        L.map("map")
        .setView(
            ARCOVERDE,
            13
        );


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        }
    ).addTo(mapa);


    criarOnibus();

}


/* ======================================================
   ÍCONE ÔNIBUS
====================================================== */

function criarOnibus() {

    busMarker =
        L.marker(
            ARCOVERDE,
            {
                icon:
                    criarIconeOnibus(
                        "escolar"
                    ),

                zIndexOffset:
                    1000
            }
        )
        .addTo(mapa);


    busMarker.bindPopup(`
        <div class="popup-title">
            🚌 Ônibus
        </div>

        <div class="popup-subtitle">
            Veículo em simulação
        </div>
    `);

}


function criarIconeOnibus(tipo) {

    return L.divIcon({

        className: "",

        html:
            `<div class="bus-marker ${tipo}">
                🚌
            </div>`,

        iconSize:
            [42, 42],

        iconAnchor:
            [21, 21],

        popupAnchor:
            [0, -22]

    });

}


/* ======================================================
   GEOCODIFICAÇÃO
====================================================== */

async function geocodificar(
    endereco
) {

    const params =
        new URLSearchParams({

            q: endereco,

            format: "json",

            limit: "1",

            countrycodes: "br"

        });


    try {

        const response =
            await fetch(
                `${NOMINATIM_URL}?${params}`
            );


        if (!response.ok) {

            throw new Error(
                "Erro Nominatim"
            );

        }


        const data =
            await response.json();


        if (!data.length) {

            return null;

        }


        return [

            Number(
                data[0].lat
            ),

            Number(
                data[0].lon
            )

        ];

    }

    catch (error) {

        console.error(
            error
        );

        return null;

    }

}


/* ======================================================
   PREPARAR PONTOS
====================================================== */

async function prepararPontos(
    linha
) {

    const resultado = [];


    for (
        const ponto of linha.pontos
    ) {

        let nome =
            ponto.nome;

        let endereco =
            ponto.busca;


        /*
        ESCOLA
        */

        if (
            ponto.tipo === "escola"
        ) {

            const escola =
                escolas[
                    ponto.escola
                ];


            if (!escola) {

                continue;

            }


            nome =
                escola.nome;

            endereco =
                escola.endereco;

        }


        const coordenadas =
            await geocodificar(
                endereco
            );


        if (!coordenadas) {

            console.warn(
                "Ponto não localizado:",
                nome
            );

            continue;

        }


        resultado.push({

            nome,

            tipo:
                ponto.tipo,

            coordenadas,

            endereco

        });


        /*
        Respeita intervalo
        do Nominatim.
        */

        await esperar(
            1100
        );

    }


    return resultado;

}


/* ======================================================
   CALCULAR ROTA REAL
====================================================== */

async function calcularRota(
    pontos
) {

    const coordenadas =
        pontos
        .map(
            ponto =>
                `${ponto.coordenadas[1]},${ponto.coordenadas[0]}`
        )
        .join(";");


    const url =
        `${OSRM_URL}/${coordenadas}` +
        "?overview=full" +
        "&geometries=geojson";


    const response =
        await fetch(
            url
        );


    if (!response.ok) {

        throw new Error(
            "Falha no roteamento"
        );

    }


    const data =
        await response.json();


    if (
        data.code !== "Ok" ||
        !data.routes.length
    ) {

        throw new Error(
            "Rota não encontrada"
        );

    }


    return data.routes[0];

}


/* ======================================================
   DESENHAR ROTA
====================================================== */

function desenharRota(
    route
) {

    if (rotaLayer) {

        mapa.removeLayer(
            rotaLayer
        );

    }


    routeCoordinates =
        route.geometry.coordinates
        .map(
            ponto => [
                ponto[1],
                ponto[0]
            ]
        );


    const cor =
        tipoAtual === "escolar"
            ? "#f59e0b"
            : "#168cff";


    rotaLayer =
        L.polyline(
            routeCoordinates,
            {

                color: cor,

                weight: 7,

                opacity: .9,

                lineJoin:
                    "round"

            }
        )
        .addTo(mapa);


    mapa.fitBounds(
        rotaLayer.getBounds(),
        {
            padding:
                [40, 40]
        }
    );

}


/* ======================================================
   MARCADORES
====================================================== */

function desenharPontos(
    pontos
) {

    stopMarkers.forEach(
        marker =>
            mapa.removeLayer(
                marker
            )
    );


    stopMarkers = [];


    pontos.forEach(
        (ponto) => {

            let emoji =
                "📍";

            let border =
                "#168cff";


            if (
                ponto.tipo ===
                "escola"
            ) {

                emoji =
                    "🏫";

                border =
                    "#f59e0b";

            }


            if (
                ponto.tipo ===
                "bairro"
            ) {

                emoji =
                    "🏘️";

                border =
                    "#168cff";

            }


            const icon =
                L.divIcon({

                    className: "",

                    html: `
                        <div style="
                            width:30px;
                            height:30px;
                            border-radius:50%;
                            background:#0b1726;
                            border:3px solid ${border};
                            display:grid;
                            place-items:center;
                            font-size:13px;
                        ">
                            ${emoji}
                        </div>
                    `,

                    iconSize:
                        [30, 30],

                    iconAnchor:
                        [15, 15]

                });


            const marker =
                L.marker(
                    ponto.coordenadas,
                    {
                        icon
                    }
                )
                .addTo(mapa);


            marker.bindPopup(`
                <div class="popup-title">
                    ${emoji}
                    ${escaparHTML(
                        ponto.nome
                    )}
                </div>

                <div class="popup-subtitle">

                    ${
                        ponto.tipo === "escola"
                            ? "Escola"
                            : ponto.tipo === "bairro"
                                ? "Bairro"
                                : "Parada de ônibus"
                    }

                </div>
            `);


            stopMarkers.push(
                marker
            );

        }
    );

}


/* ======================================================
   LISTA DE PONTOS
====================================================== */

function atualizarLista(
    pontos
) {

    const lista =
        document.getElementById(
            "stopList"
        );


    lista.innerHTML = "";


    pontos.forEach(
        (ponto, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "stop-item";


            item.dataset.index =
                index;


            let emoji =
                "📍";

            let tipo =
                "Parada";


            if (
                ponto.tipo ===
                "escola"
            ) {

                emoji =
                    "🏫";

                tipo =
                    "Escola";

            }


            if (
                ponto.tipo ===
                "bairro"
            ) {

                emoji =
                    "🏘️";

                tipo =
                    "Bairro";

            }


            item.innerHTML = `

                <div class="stop-icon">
                    ${emoji}
                </div>

                <div>

                    <div class="stop-name">
                        ${escaparHTML(
                            ponto.nome
                        )}
                    </div>

                    <span class="stop-type">
                        ${tipo}
                    </span>

                </div>

                <div class="stop-state">
                    🔵
                </div>

            `;


            lista.appendChild(
                item
            );

        }
    );

}


/* ======================================================
   ATUALIZAR ESTADOS
====================================================== */

function atualizarEstados(
    pontos,
    indice
) {

    const itens =
        document.querySelectorAll(
            ".stop-item"
        );


    itens.forEach(
        (item, i) => {

            item.classList.remove(
                "next",
                "passed"
            );


            const estado =
                item.querySelector(
                    ".stop-state"
                );


            if (
                i < indice
            ) {

                item.classList.add(
                    "passed"
                );

                estado.textContent =
                    "✓";

            }

            else if (
                i === indice
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


    if (
        pontos[indice]
    ) {

        document.getElementById(
            "nextStop"
        ).textContent =
            pontos[indice].nome;

    }


    document.getElementById(
        "stopCounter"
    ).textContent =
        `${Math.min(
            indice,
            pontos.length
        )} / ${pontos.length}`;

}


/* ======================================================
   ANIMAÇÃO
====================================================== */

function iniciarAnimacao(
    pontos
) {

    if (
        !routeCoordinates.length
    ) {

        return;

    }


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    animationIndex =
        0;


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

            animationIndex =
                0;

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


        const indice =
            encontrarPontoMaisProximo(
                posicao,
                pontos
            );


        atualizarEstados(
            pontos,
            indice
        );


        atualizarDistancia(
            posicao,
            pontos[indice]
        );


        animationIndex +=
            .45;


        animationFrame =
            requestAnimationFrame(
                animar
            );

    }


    animationFrame =
        requestAnimationFrame(
            animar
        );

}


/* ======================================================
   PONTO MAIS PRÓXIMO
====================================================== */

function encontrarPontoMaisProximo(
    posicao,
    pontos
) {

    let menor =
        Infinity;

    let indice =
        0;


    pontos.forEach(
        (ponto, i) => {

            const distancia =
                distanciaMetros(
                    posicao,
                    ponto.coordenadas
                );


            if (
                distancia <
                menor
            ) {

                menor =
                    distancia;

                indice =
                    i;

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
    ponto
) {

    if (!ponto) {

        return;

    }


    const distancia =
        distanciaMetros(
            posicao,
            ponto.coordenadas
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
        ) ** 2;


    const y =
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(
            dLon / 2
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
   FORMATAÇÃO
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

        return `${Math.round(
            metros
        )} m`;

    }


    return `${(
        metros / 1000
    ).toFixed(1)} km`;

}


/* ======================================================
   CARREGAR SELECT
====================================================== */

function atualizarSelect() {

    const select =
        document.getElementById(
            "lineSelect"
        );


    select.innerHTML = "";


    const linhas =
        tipoAtual === "escolar"
            ? linhasEscolares
            : linhasPublicas;


    Object.entries(
        linhas
    ).forEach(
        ([id, linha]) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                id;


            option.textContent =
                `${id} — ${linha.nome}`;


            select.appendChild(
                option
            );

        }
    );


    linhaAtual =
        Object.keys(
            linhas
        )[0];


    select.value =
        linhaAtual;

}


/* ======================================================
   ATUALIZAR INTERFACE
====================================================== */

function atualizarInterface() {

    const escolar =
        tipoAtual ===
        "escolar";


    const btnEscolar =
        document.getElementById(
            "btnEscolar"
        );


    const btnPublico =
        document.getElementById(
            "btnPublico"
        );


    btnEscolar.classList.toggle(
        "active",
        escolar
    );


    btnPublico.classList.toggle(
        "active",
        !escolar
    );


    document
        .getElementById(
            "schoolLegend"
        )
        .classList.toggle(
            "hidden",
            !escolar
        );


    document
        .getElementById(
            "neighborhoodLegend"
        )
        .classList.toggle(
            "hidden",
            escolar
        );


    atualizarSelect();

}


/* ======================================================
   CARREGAR LINHA
====================================================== */

async function carregarLinha(
    id
) {

    linhaAtual =
        id;


    const linhas =
        tipoAtual === "escolar"
            ? linhasEscolares
            : linhasPublicas;


    const linha =
        linhas[id];


    if (!linha) {

        return;

    }


    document.getElementById(
        "lineBadge"
    ).textContent =
        id;


    document.getElementById(
        "lineBadge"
    ).className =
        `line-badge ${
            tipoAtual
        }`;


    document.getElementById(
        "busType"
    ).textContent =
        tipoAtual === "escolar"
            ? "Ônibus Escolar"
            : "Ônibus Público";


    document.getElementById(
        "speed"
    ).textContent =
        `${linha.velocidade} km/h`;


    document.getElementById(
        "routeName"
    ).textContent =
        `${id} — ${linha.nome}`;


    document.getElementById(
        "routeMode"
    ).textContent =
        tipoAtual === "escolar"
            ? "🏫 Rota escolar"
            : "🚌 Rota transporte público";


    document.getElementById(
        "routeMode"
    ).className =
        `map-mode ${
            tipoAtual === "escolar"
                ? "escolar-mode"
                : "publico-mode"
        }`;


    busMarker.setIcon(
        criarIconeOnibus(
            tipoAtual
        )
    );


    document.getElementById(
        "stopList"
    ).textContent =
        "Localizando pontos...";


    try {

        const pontos =
            await prepararPontos(
                linha
            );


        if (
            pontos.length < 2
        ) {

            throw new Error(
                "Poucos pontos encontrados."
            );

        }


        pontosAtuais =
            pontos;


        atualizarLista(
            pontos
        );


        desenharPontos(
            pontos
        );


        const rota =
            await calcularRota(
                pontos
            );


        desenharRota(
            rota
        );


        iniciarAnimacao(
            pontos
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

                Não foi possível
                montar esta rota.

                <br><br>

                Verifique sua conexão
                com a internet.

            </div>

        `;

    }

}


/* ======================================================
   EVENTOS
====================================================== */

function configurarEventos() {

    document
        .getElementById(
            "btnEscolar"
        )
        .addEventListener(
            "click",
            async () => {

                tipoAtual =
                    "escolar";

                atualizarInterface();

                await carregarLinha(
                    "ESC-01"
                );

            }
        );


    document
        .getElementById(
            "btnPublico"
        )
        .addEventListener(
            "click",
            async () => {

                tipoAtual =
                    "publico";

                atualizarInterface();

                await carregarLinha(
                    "PUB-01"
                );

            }
        );


    document
        .getElementById(
            "lineSelect"
        )
        .addEventListener(
            "change",
            async event => {

                await carregarLinha(
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

                mapa.setView(
                    busMarker.getLatLng(),
                    16
                );

                busMarker.openPopup();

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
   INICIAR
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        iniciarMapa();

        configurarEventos();

        atualizarInterface();

        await carregarLinha(
            "ESC-01"
        );

    }
);
