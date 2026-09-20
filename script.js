/* =====================================================
   ARCOVERDE BUS
   SCRIPT.JS

   Protótipo acadêmico.
   Rotas e coordenadas são demonstrativas.
===================================================== */


/* =====================================================
   CONFIGURAÇÃO
===================================================== */

const ARCOVERDE = [-8.4189, -37.0531];

const OSRM_URL =
    "https://router.project-osrm.org/route/v1/driving";


/* =====================================================
   DADOS DEMONSTRATIVOS
===================================================== */

/*
    IMPORTANTE:

    Os pontos abaixo são coordenadas aproximadas para
    demonstração do sistema.

    Não representam itinerários oficiais.
*/


const escolas = {

    rotary: {
        nome: "Escola Municipal Rotary",
        tipo: "escola",
        endereco: "São Cristóvão",
        coords: [-8.4128, -37.0570]
    },

    alfabeto: {
        nome: "Escola Municipal Alfabeto",
        tipo: "escola",
        endereco: "São Cristóvão",
        coords: [-8.4144, -37.0582]
    },

    sebastiao: {
        nome: "Escola Municipal Sebastião Luiz Cavalcanti",
        tipo: "escola",
        endereco: "São Cristóvão",
        coords: [-8.4160, -37.0558]
    },

    gumercindo: {
        nome: "Escola Municipal Gumercindo Cavalcanti",
        tipo: "escola",
        endereco: "Tamboril",
        coords: [-8.4260, -37.0460]
    },

    antonioCosta: {
        nome: "Escola Municipal Antônio Costa Leitão",
        tipo: "escola",
        endereco: "Tamboril",
        coords: [-8.4245, -37.0448]
    },

    joseMedeiros: {
        nome: "Escola Municipal José Medeiros da Fonseca",
        tipo: "escola",
        endereco: "Sucupira",
        coords: [-8.4305, -37.0510]
    },

    antonioJoaquim: {
        nome: "Escola Municipal Antônio Joaquim da Silva",
        tipo: "escola",
        endereco: "Boa Vista",
        coords: [-8.4075, -37.0650]
    },

    olga: {
        nome: "Escola Municipal Olga Gueiros Leite",
        tipo: "escola",
        endereco: "Centro",
        coords: [-8.4173, -37.0550]
    }

};


/* =====================================================
   LINHAS ESCOLARES
===================================================== */

const linhasEscolares = {

    "ESC-01": {

        nome: "Escolar São Cristóvão",

        tipo: "escolar",

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
                nome: escolas.rotary.nome,
                tipo: "escola",
                coords: escolas.rotary.coords
            },

            {
                nome: escolas.alfabeto.nome,
                tipo: "escola",
                coords: escolas.alfabeto.coords
            },

            {
                nome: escolas.sebastiao.nome,
                tipo: "escola",
                coords: escolas.sebastiao.coords
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

        tipo: "escolar",

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
                nome: escolas.antonioJoaquim.nome,
                tipo: "escola",
                coords: escolas.antonioJoaquim.coords
            },

            {
                nome: "Sucupira",
                tipo: "bairro",
                coords: [-8.4300, -37.0515]
            },

            {
                nome: escolas.joseMedeiros.nome,
                tipo: "escola",
                coords: escolas.joseMedeiros.coords
            },

            {
                nome: "Centro",
                tipo: "bairro",
                coords: [-8.4180, -37.0540]
            },

            {
                nome: escolas.olga.nome,
                tipo: "escola",
                coords: escolas.olga.coords
            }

        ]

    },


    "ESC-03": {

        nome: "Escolar Tamboril",

        tipo: "escolar",

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
                nome: escolas.gumercindo.nome,
                tipo: "escola",
                coords: escolas.gumercindo.coords
            },

            {
                nome: escolas.antonioCosta.nome,
                tipo: "escola",
                coords: escolas.antonioCosta.coords
            }

        ]

    }

};


/* =====================================================
   LINHAS PÚBLICAS
===================================================== */

const linhasPublicas = {

    "PUB-01": {

        nome: "Centro → São Cristóvão",

        tipo: "publico",

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

        tipo: "publico",

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

        tipo: "publico",

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

        tipo: "publico",

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

};


/* =====================================================
   ESTADO
===================================================== */

let mapa;

let rotaLayer = null;

let busMarker = null;

let stopMarkers = [];

let routeCoordinates = [];

let animationFrame = null;

let animationIndex = 0;

let simulationRunning = true;

let tipoAtual = "escolar";

let linhaAtual = null;

let pontosAtuais = [];

let favoritos = JSON.parse(
    localStorage.getItem("arcoverdeBusFavoritos") || "[]"
);

let presentationIndex = 0;


/* =====================================================
   INICIAR MAPA
===================================================== */

function iniciarMapa() {

    mapa = L.map("map", {
        zoomControl: true
    }).setView(
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
    ).addTo(mapa);


    criarOnibus();

}


/* =====================================================
   ÍCONE DO ÔNIBUS
===================================================== */

function criarIconeOnibus(tipo) {

    const classe =
        tipo === "escolar"
            ? "escolar"
            : "publico";


    return L.divIcon({

        className: "",

        html: `
            <div class="bus-marker ${classe}">
                🚌
            </div>
        `,

        iconSize: [42, 42],

        iconAnchor: [21, 21]

    });

}


/* =====================================================
   CRIAR ÔNIBUS
===================================================== */

function criarOnibus() {

    busMarker = L.marker(
        ARCOVERDE,
        {
            icon: criarIconesOnibus("escolar"),
            zIndexOffset: 1000
        }
    ).addTo(mapa);


    busMarker.bindPopup(
        `
        <div class="popup-title">
            🚌 Ônibus em movimento
        </div>

        <div class="popup-type">
            Simulação acadêmica
        </div>
        `
    );

}


/* =====================================================
   LIMPAR MAPA
===================================================== */

function limparMapa() {

    if (rotaLayer) {

        mapa.removeLayer(rotaLayer);

        rotaLayer = null;

    }


    stopMarkers.forEach(marker => {

        mapa.removeLayer(marker);

    });


    stopMarkers = [];

}


/* =====================================================
   CALCULAR ROTA PELAS RUAS
===================================================== */

async function calcularRota(pontos) {

    if (!pontos || pontos.length < 2) {

        return [];

    }


    const coordenadas = pontos
        .map(p => `${p.coords[1]},${p.coords[0]}`)
        .join(";");


    const url =
        `${OSRM_URL}/${coordenadas}` +
        `?overview=full&geometries=geojson`;


    try {

        const resposta = await fetch(url);


        if (!resposta.ok) {

            throw new Error(
                "Falha no serviço de rota."
            );

        }


        const dados = await resposta.json();


        if (
            !dados.routes ||
            !dados.routes.length
        ) {

            throw new Error(
                "Rota não encontrada."
            );

        }


        return dados.routes[0]
            .geometry
            .coordinates
            .map(coord => [
                coord[1],
                coord[0]
            ]);

    } catch (erro) {

        console.warn(
            "OSRM indisponível. Usando rota alternativa.",
            erro
        );


        /*
            ROTA ALTERNATIVA

            Caso o serviço de ruas esteja indisponível,
            o sistema conecta os pontos diretamente.
        */

        return pontos.map(
            p => p.coords
        );

    }

}


/* =====================================================
   DESENHAR ROTA
===================================================== */

function desenharRota(route) {

    if (!route.length) {

        return;

    }


    const cor =
        tipoAtual === "escolar"
            ? "#ff7900"
            : "#008cff";


    rotaLayer = L.polyline(
        route,
        {
            color: cor,

            weight: 6,

            opacity: .85,

            lineJoin: "round",

            lineCap: "round"
        }
    ).addTo(mapa);


    mapa.fitBounds(
        rotaLayer.getBounds(),
        {
            padding: [40, 40]
        }
    );

}


/* =====================================================
   DESENHAR PONTOS
===================================================== */

function desenharPontos(pontos) {

    pontos.forEach(
        (ponto, index) => {

            let emoji = "📍";

            if (
                ponto.tipo === "escola"
            ) {

                emoji = "🏫";

            }

            if (
                ponto.tipo === "bairro"
            ) {

                emoji = "🏘️";

            }


            const marker =
                L.marker(
                    ponto.coords,
                    {
                        icon: L.divIcon({

                            className:
                                "custom-point",

                            html: `
                                <div
                                    style="
                                    font-size:22px;
                                    text-align:center;
                                    ">
                                    ${emoji}
                                </div>
                            `,

                            iconSize: [
                                28,
                                28
                            ],

                            iconAnchor: [
                                14,
                                14
                            ]

                        })
                    }
                ).addTo(mapa);


            marker.bindPopup(
                `
                <div class="popup-title">
                    ${emoji}
                    ${escaparHTML(ponto.nome)}
                </div>

                <div class="popup-type">
                    ${tipoPonto(ponto.tipo)}
                </div>

                <div class="popup-type">
                    Ponto ${index + 1}
                </div>
                `
            );


            marker.on(
                "click",
                () => {

                    mapa.flyTo(
                        ponto.coords,
                        16,
                        {
                            duration: .7
                        }
                    );

                }
            );


            stopMarkers.push(marker);

        }
    );

}


/* =====================================================
   TEXTO DO TIPO
===================================================== */

function tipoPonto(tipo) {

    if (tipo === "escola") {

        return "Escola";

    }

    if (tipo === "bairro") {

        return "Bairro";

    }

    return "Parada de ônibus";

}


/* =====================================================
   LISTA DE PONTOS
===================================================== */

function atualizarLista(pontos) {

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


            let emoji = "📍";


            if (
                ponto.tipo === "escola"
            ) {

                emoji = "🏫";

            }


            if (
                ponto.tipo === "bairro"
            ) {

                emoji = "🏘️";

            }


            item.innerHTML = `

                <div class="stop-number">
                    ${index + 1}
                </div>

                <div class="stop-info">

                    <strong>
                        ${emoji}
                        ${escaparHTML(ponto.nome)}
                    </strong>

                    <span>
                        ${tipoPonto(ponto.tipo)}
                    </span>

                </div>

            `;


            item.addEventListener(
                "click",
                () => {

                    mapa.flyTo(
                        ponto.coords,
                        16,
                        {
                            duration: .7
                        }
                    );


                    if (
                        stopMarkers[index]
                    ) {

                        stopMarkers[index]
                            .openPopup();

                    }

                }
            );


            lista.appendChild(item);

        }
    );

}


/* =====================================================
   ATUALIZAR DASHBOARD
===================================================== */

function atualizarDashboard() {

    const linhas =
        tipoAtual === "escolar"
            ? linhasEscolares
            : linhasPublicas;


    const quantidadeLinhas =
        Object.keys(linhas).length;


    const quantidadeParadas =
        pontosAtuais.filter(
            p => p.tipo === "parada"
        ).length;


    const quantidadeLocais =
        pontosAtuais.filter(
            p =>
                p.tipo === "escola" ||
                p.tipo === "bairro"
        ).length;


    document.getElementById(
        "totalLines"
    ).textContent =
        quantidadeLinhas;


    document.getElementById(
        "totalBuses"
    ).textContent = "1";


    document.getElementById(
        "totalStops"
    ).textContent =
        quantidadeParadas;


    document.getElementById(
        "totalPlaces"
    ).textContent =
        quantidadeLocais;

}


/* =====================================================
   ATUALIZAR INTERFACE
===================================================== */

function atualizarInterface() {

    const linhas =
        tipoAtual === "escolar"
            ? linhasEscolares
            : linhasPublicas;


    const select =
        document.getElementById(
            "lineSelect"
        );


    select.innerHTML = "";


    Object.entries(linhas)
        .forEach(
            ([id, linha]) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value = id;

                option.textContent =
                    `${id} — ${linha.nome}`;


                select.appendChild(
                    option
                );

            }
        );


    const primeiraLinha =
        Object.keys(linhas)[0];


    carregarLinha(
        primeiraLinha
    );

}


/* =====================================================
   CARREGAR LINHA
===================================================== */

async function carregarLinha(id) {

    const linhas =
        tipoAtual === "escolar"
            ? linhasEscolares
            : linhasPublicas;


    const linha =
        linhas[id];


    if (!linha) {

        return;

    }


    linhaAtual = linha;

    pontosAtuais =
        linha.pontos;


    animationIndex = 0;


    pararAnimacao();


    limparMapa();


    atualizarTextosLinha(
        id,
        linha
    );


    desenharPontos(
        pontosAtuais
    );


    atualizarLista(
        pontosAtuais
    );


    atualizarDashboard();


    busMarker.setIcon(
        criarIconesOnibus(
            tipoAtual
        )
    );


    busMarker.setLatLng(
        pontosAtuais[0].coords
    );


    document.getElementById(
        "speed"
    ).textContent =
        linha.velocidade;


    const rota =
        await calcularRota(
            pontosAtuais
        );


    routeCoordinates =
        rota;


    desenharRota(
        routeCoordinates
    );


    iniciarAnimacao();

}


/* =====================================================
   ATUALIZAR TEXTOS
===================================================== */

function atualizarTextosLinha(
    id,
    linha
) {

    const escolar =
        tipoAtual === "escolar";


    const badge =
        document.getElementById(
            "lineBadge"
        );


    badge.textContent = id;


    badge.className =
        `line-badge ${
            escolar
                ? "escolar"
                : "publico"
        }`;


    document.getElementById(
        "routeName"
    ).textContent =
        linha.nome;


    const routeMode =
        document.getElementById(
            "routeMode"
        );


    routeMode.textContent =
        escolar
            ? "🏫 Transporte Escolar"
            : "🚌 Transporte Público";


    routeMode.className =
        `route-mode ${
            escolar
                ? "escolar-mode"
                : "publico-mode"
        }`;


    document.getElementById(
        "busType"
    ).textContent =
        escolar
            ? "Escolar"
            : "Público";


    document.getElementById(
        "pointListTitle"
    ).textContent =
        escolar
            ? "🏫 Escolas e paradas"
            : "🏘️ Bairros e paradas";


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


    atualizarFavorito();

}


/* =====================================================
   ANIMAÇÃO
===================================================== */

function iniciarAnimacao() {

    if (
        !routeCoordinates.length
    ) {

        return;

    }


    simulationRunning = true;


    document.getElementById(
        "toggleSimulation"
    ).textContent =
        "⏸️ Pausar simulação";


    animationIndex = 0;


    animarOnibus();

}


/* =====================================================
   ANIMAR ÔNIBUS
===================================================== */

function animarOnibus() {

    if (
        !simulationRunning ||
        !routeCoordinates.length
    ) {

        return;

    }


    const posicao =
        routeCoordinates[
            animationIndex
        ];


    busMarker.setLatLng(
        posicao
    );


    atualizarEstados(
        posicao
    );


    animationIndex++;


    if (
        animationIndex >=
        routeCoordinates.length
    ) {

        animationIndex = 0;

    }


    animationFrame =
        setTimeout(
            () => {

                requestAnimationFrame(
                    animarOnibus
                );

            },
            120
        );

}


/* =====================================================
   PARAR
===================================================== */

function pararAnimacao() {

    simulationRunning = false;


    if (animationFrame) {

        clearTimeout(
            animationFrame
        );

        animationFrame = null;

    }

}


/* =====================================================
   PAUSAR / CONTINUAR
===================================================== */

function alternarSimulacao() {

    if (simulationRunning) {

        pararAnimacao();


        document.getElementById(
            "toggleSimulation"
        ).textContent =
            "▶️ Continuar simulação";


        document.getElementById(
            "simulationLabel"
        ).textContent =
            "⏸️ Simulação pausada";

    } else {

        simulationRunning = true;


        document.getElementById(
            "toggleSimulation"
        ).textContent =
            "⏸️ Pausar simulação";


        document.getElementById(
            "simulationLabel"
        ).textContent =
            "🟢 Simulação ativa";


        animarOnibus();

    }

}


/* =====================================================
   ATUALIZAR ESTADOS
===================================================== */

function atualizarEstados(
    posicao
) {

    const ponto =
        encontrarPontoMaisProximo(
            posicao,
            pontosAtuais
        );


    if (!ponto) {

        return;

    }


    document.getElementById(
        "nextStop"
    ).textContent =
        ponto.ponto.nome;


    document.getElementById(
        "mapNextStop"
    ).textContent =
        ponto.ponto.nome;


    document.getElementById(
        "stopCounter"
    ).textContent =
        `${ponto.index + 1}/${pontosAtuais.length}`;


    document.getElementById(
        "distance"
    ).textContent =
        formatarDistancia(
            ponto.distancia
        );


    document.querySelectorAll(
        ".stop-item"
    ).forEach(
        item => {

            item.classList.remove(
                "active"
            );

        }
    );


    const item =
        document.querySelector(
            `.stop-item[data-index="${ponto.index}"]`
        );


    if (item) {

        item.classList.add(
            "active"
        );

    }

}


/* =====================================================
   PONTO MAIS PRÓXIMO
===================================================== */

function encontrarPontoMaisProximo(
    posicao,
    pontos
) {

    let menorDistancia =
        Infinity;


    let pontoEncontrado =
        null;


    let indiceEncontrado =
        0;


    pontos.forEach(
        (ponto, index) => {

            const distancia =
                distanciaMetros(
                    posicao,
                    ponto.coords
                );


            if (
                distancia <
                menorDistancia
            ) {

                menorDistancia =
                    distancia;

                pontoEncontrado =
                    ponto;

                indiceEncontrado =
                    index;

            }

        }
    );


    return {

        ponto: pontoEncontrado,

        index: indiceEncontrado,

        distancia: menorDistancia

    };

}


/* =====================================================
   DISTÂNCIA HAVERSINE
===================================================== */

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
        ) ** 2
        +
        Math.cos(lat1)
        *
        Math.cos(lat2)
        *
        Math.sin(
            deltaLon / 2
        ) ** 2;


    const y =
        2 *
        Math.atan2(
            Math.sqrt(x),
            Math.sqrt(1 - x)
        );


    return R * y;

}


/* =====================================================
   FORMATAR DISTÂNCIA
===================================================== */

function formatarDistancia(
    metros
) {

    if (
        metros < 1000
    ) {

        return `${Math.round(metros)} m`;

    }


    return `${(
        metros / 1000
    ).toFixed(1)} km`;

}


/* =====================================================
   FAVORITOS
===================================================== */

function atualizarFavorito() {

    if (!linhaAtual) {

        return;

    }


    const select =
        document.getElementById(
            "lineSelect"
        );


    const id =
        select.value;


    const button =
        document.getElementById(
            "favoriteBtn"
        );


    const favorito =
        favoritos.includes(id);


    button.classList.toggle(
        "active",
        favorito
    );


    button.textContent =
        favorito
            ? "★ Remover dos favoritos"
            : "☆ Adicionar aos favoritos";

}


/* =====================================================
   ALTERAR FAVORITO
===================================================== */

function alternarFavorito() {

    const id =
        document.getElementById(
            "lineSelect"
        ).value;


    if (!id) {

        return;

    }


    if (
        favoritos.includes(id)
    ) {

        favoritos =
            favoritos.filter(
                item =>
                    item !== id
            );

    } else {

        favoritos.push(id);

    }


    localStorage.setItem(
        "arcoverdeBusFavoritos",
        JSON.stringify(
            favoritos
        )
    );


    atualizarFavorito();

}


/* =====================================================
   CENTRALIZAR ÔNIBUS
===================================================== */

function centralizarOnibus() {

    if (!busMarker) {

        return;

    }


    mapa.flyTo(
        busMarker.getLatLng(),
        16,
        {
            duration: .8
        }
    );

}


/* =====================================================
   MOSTRAR ROTA
===================================================== */

function mostrarRota() {

    if (
        rotaLayer
    ) {

        mapa.fitBounds(
            rotaLayer.getBounds(),
            {
                padding: [
                    50,
                    50
                ]
            }
        );

    }

}


/* =====================================================
   RESTAURAR MAPA
===================================================== */

function restaurarMapa() {

    mapa.setView(
        ARCOVERDE,
        14
    );

}


/* =====================================================
   TROCAR TIPO
===================================================== */

function trocarTipo(
    tipo
) {

    if (
        tipoAtual === tipo
    ) {

        return;

    }


    tipoAtual = tipo;


    document
        .getElementById(
            "btnEscolar"
        )
        .classList.toggle(
            "active",
            tipo === "escolar"
        );


    document
        .getElementById(
            "btnPublico"
        )
        .classList.toggle(
            "active",
            tipo === "publico"
        );


    atualizarInterface();

}


/* =====================================================
   EVENTOS
===================================================== */

function configurarEventos() {

    document
        .getElementById(
            "btnEscolar"
        )
        .addEventListener(
            "click",
            () => {

                trocarTipo(
                    "escolar"
                );

            }
        );


    document
        .getElementById(
            "btnPublico"
        )
        .addEventListener(
            "click",
            () => {

                trocarTipo(
                    "publico"
                );

            }
        );


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
            "favoriteBtn"
        )
        .addEventListener(
            "click",
            alternarFavorito
        );


    document
        .getElementById(
            "centerBus"
        )
        .addEventListener(
            "click",
            centralizarOnibus
        );


    document
        .getElementById(
            "toggleSimulation"
        )
        .addEventListener(
            "click",
            alternarSimulacao
        );


    document
        .getElementById(
            "fitRoute"
        )
        .addEventListener(
            "click",
            mostrarRota
        );


    document
        .getElementById(
            "resetView"
        )
        .addEventListener(
            "click",
            restaurarMapa
        );


    document
        .getElementById(
            "presentationBtn"
        )
        .addEventListener(
            "click",
            abrirApresentacao
        );


    document
        .getElementById(
            "aboutBtn"
        )
        .addEventListener(
            "click",
            () => {

                abrirModal(
                    "aboutModal"
                );

            }
        );


    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        fecharModal(
                            button.dataset.close
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "prevSlide"
        )
        .addEventListener(
            "click",
            slideAnterior
        );


    document
        .getElementById(
            "nextSlide"
        )
        .addEventListener(
            "click",
            proximoSlide
        );


    document
        .getElementById(
            "presentationModal"
        )
        .addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "presentationModal"
                ) {

                    fecharModal(
                        "presentationModal"
                    );

                }

            }
        );


    document
        .getElementById(
            "aboutModal"
        )
        .addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "aboutModal"
                ) {

                    fecharModal(
                        "aboutModal"
                    );

                }

            }
        );

}


/* =====================================================
   MODAL
===================================================== */

function abrirModal(
    id
) {

    document
        .getElementById(id)
        .classList.add(
            "show"
        );

}


function fecharModal(
    id
) {

    document
        .getElementById(id)
        .classList.remove(
            "show"
        );

}


/* =====================================================
   APRESENTAÇÃO
===================================================== */

function abrirApresentacao() {

    presentationIndex = 0;

    atualizarSlide();

    abrirModal(
        "presentationModal"
    );

}


/* =====================================================
   ATUALIZAR SLIDE
===================================================== */

function atualizarSlide() {

    const slides =
        document.querySelectorAll(
            ".presentation-slide"
        );


    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === presentationIndex
            );

        }
    );


    document.getElementById(
        "slideIndicator"
    ).textContent =
        `${presentationIndex + 1} / ${slides.length}`;

}


/* =====================================================
   PRÓXIMO SLIDE
===================================================== */

function proximoSlide() {

    const slides =
        document.querySelectorAll(
            ".presentation-slide"
        );


    presentationIndex++;


    if (
        presentationIndex >=
        slides.length
    ) {

        presentationIndex = 0;

    }


    atualizarSlide();

}


/* =====================================================
   SLIDE ANTERIOR
===================================================== */

function slideAnterior() {

    const slides =
        document.querySelectorAll(
            ".presentation-slide"
        );


    presentationIndex--;


    if (
        presentationIndex < 0
    ) {

        presentationIndex =
            slides.length - 1;

    }


    atualizarSlide();

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

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


/* =====================================================
   TECLADO
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        const modal =
            document.querySelector(
                ".modal.show"
            );


        if (!modal) {

            return;

        }


        if (
            event.key ===
            "Escape"
        ) {

            modal.classList.remove(
                "show"
            );

        }


        if (
            modal.id ===
            "presentationModal"
        ) {

            if (
                event.key ===
                "ArrowRight"
            ) {

                proximoSlide();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                slideAnterior();

            }

        }

    }
);


/* =====================================================
   INICIAR SISTEMA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarMapa();

        configurarEventos();

        atualizarInterface();

    }
);
