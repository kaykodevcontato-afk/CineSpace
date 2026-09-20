/* =====================================================
   ARCOVERDE BUS
   Protótipo de localização de ônibus
===================================================== */


/* =====================================================
   CONFIGURAÇÃO DO MAPA
===================================================== */

const mapa = L.map("map").setView(
    [-8.41889, -37.05389],
    13
);


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
    }
).addTo(mapa);


/* =====================================================
   DADOS DAS LINHAS

   ATENÇÃO:
   Estes dados são apenas DEMONSTRAÇÃO.
===================================================== */

const ROTAS = [

    {
        id: "publico-01",

        nome: "Linha 01 — Centro / Bairro",

        tipo: "Transporte Público",

        numeroOnibus: "BUS-001",

        velocidade: 25,

        cor: "#087f5b",

        paradas: [

            {
                nome: "Terminal",
                lat: -8.41889,
                lng: -37.05389
            },

            {
                nome: "Parada 02",
                lat: -8.41650,
                lng: -37.04900
            },

            {
                nome: "Parada 03",
                lat: -8.41400,
                lng: -37.04400
            },

            {
                nome: "Parada 04",
                lat: -8.41050,
                lng: -37.04000
            },

            {
                nome: "Parada 05",
                lat: -8.40700,
                lng: -37.04500
            },

            {
                nome: "Parada 06",
                lat: -8.40950,
                lng: -37.05200
            },

            {
                nome: "Parada 07",
                lat: -8.41400,
                lng: -37.05600
            },

            {
                nome: "Terminal de retorno",
                lat: -8.41889,
                lng: -37.05389
            }

        ]
    },


    {
        id: "escolar-01",

        nome: "Escolar 01 — Rota Demonstrativa",

        tipo: "Transporte Escolar",

        numeroOnibus: "ESC-001",

        velocidade: 30,

        cor: "#1971c2",

        paradas: [

            {
                nome: "Ponto Inicial",
                lat: -8.42500,
                lng: -37.06000
            },

            {
                nome: "Parada Escolar 02",
                lat: -8.42200,
                lng: -37.05500
            },

            {
                nome: "Parada Escolar 03",
                lat: -8.41900,
                lng: -37.05000
            },

            {
                nome: "Parada Escolar 04",
                lat: -8.41600,
                lng: -37.04700
            },

            {
                nome: "Escola",
                lat: -8.41200,
                lng: -37.04400
            },

            {
                nome: "Retorno",
                lat: -8.41800,
                lng: -37.05200
            }

        ]
    }

];


/* =====================================================
   VARIÁVEIS
===================================================== */

let rotaAtual = null;

let indiceAtual = 0;

let progresso = 0;

let marcadorOnibus = null;

let marcadoresParadas = [];

let linhaMapa = null;

let intervaloMovimento = null;


/* =====================================================
   ELEMENTOS HTML
===================================================== */

const linhaSelect =
    document.getElementById("linhaSelect");

const tipoLinha =
    document.getElementById("tipoLinha");

const nomeLinha =
    document.getElementById("nomeLinha");

const busId =
    document.getElementById("busId");

const statusOnibus =
    document.getElementById("statusOnibus");

const proximaParada =
    document.getElementById("proximaParada");

const tempoChegada =
    document.getElementById("tempoChegada");

const ultimaAtualizacao =
    document.getElementById("ultimaAtualizacao");

const listaParadas =
    document.getElementById("listaParadas");

const contadorParadas =
    document.getElementById("contadorParadas");


/* =====================================================
   PREENCHER SELECT DE LINHAS
===================================================== */

ROTAS.forEach(rota => {

    const option =
        document.createElement("option");

    option.value = rota.id;

    option.textContent =
        `${rota.nome} — ${rota.tipo}`;

    linhaSelect.appendChild(option);

});


/* =====================================================
   SELECIONAR LINHA
===================================================== */

linhaSelect.addEventListener("change", function () {

    const id = this.value;

    const rota =
        ROTAS.find(item => item.id === id);

    if (!rota) {

        limparMapa();

        return;
    }

    iniciarRota(rota);

});


/* =====================================================
   INICIAR ROTA
===================================================== */

function iniciarRota(rota) {

    pararSimulacao();

    limparMapa();

    rotaAtual = rota;

    indiceAtual = 0;

    progresso = 0;


    nomeLinha.textContent =
        rota.nome;

    tipoLinha.textContent =
        rota.tipo;

    busId.textContent =
        rota.numeroOnibus;

    contadorParadas.textContent =
        `${rota.paradas.length} paradas`;


    desenharRota();

    criarParadas();

    criarOnibus();

    atualizarInformacoes();

    iniciarSimulacao();


    mapa.fitBounds(
        rota.paradas.map(p => [
            p.lat,
            p.lng
        ]),
        {
            padding: [30, 30]
        }
    );

}


/* =====================================================
   DESENHAR ROTA
===================================================== */

function desenharRota() {

    const pontos =
        rotaAtual.paradas.map(p => [
            p.lat,
            p.lng
        ]);

    linhaMapa =
        L.polyline(
            pontos,
            {
                color: rotaAtual.cor,

                weight: 6,

                opacity: 0.8
            }
        ).addTo(mapa);

}


/* =====================================================
   CRIAR PARADAS
===================================================== */

function criarParadas() {

    rotaAtual.paradas.forEach(
        (parada, index) => {

            const marcador =
                L.circleMarker(
                    [parada.lat, parada.lng],
                    {
                        radius: 7,

                        color: "#ffffff",

                        weight: 3,

                        fillColor: "#ff922b",

                        fillOpacity: 1
                    }
                ).addTo(mapa);


            marcador.bindPopup(`
                <strong>📍 Parada ${index + 1}</strong>
                <br>
                ${parada.nome}
            `);


            marcadoresParadas.push(
                marcador
            );

        }
    );

}


/* =====================================================
   ÍCONE DO ÔNIBUS
===================================================== */

const iconeOnibus =
    L.divIcon({

        className: "icone-onibus",

        html: `
            <div style="
                width:42px;
                height:42px;
                background:#087f5b;
                border:4px solid white;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:22px;
                box-shadow:0 3px 12px rgba(0,0,0,.35);
            ">
                🚌
            </div>
        `,

        iconSize: [42, 42],

        iconAnchor: [21, 21]

    });


/* =====================================================
   CRIAR ÔNIBUS
===================================================== */

function criarOnibus() {

    const primeiraParada =
        rotaAtual.paradas[0];


    marcadorOnibus =
        L.marker(
            [
                primeiraParada.lat,
                primeiraParada.lng
            ],
            {
                icon: iconeOnibus
            }
        ).addTo(mapa);


    marcadorOnibus.bindPopup(
        `<strong>🚌 ${rotaAtual.numeroOnibus}</strong>
         <br>
         Ônibus em movimento`
    );

}


/* =====================================================
   SIMULAÇÃO
===================================================== */

function iniciarSimulacao() {

    intervaloMovimento =
        setInterval(() => {

            moverOnibus();

        }, 1000);

}


/* =====================================================
   MOVER ÔNIBUS
===================================================== */

function moverOnibus() {

    if (!rotaAtual) return;


    const paradas =
        rotaAtual.paradas;


    const atual =
        paradas[indiceAtual];


    const proxima =
        paradas[
            (indiceAtual + 1)
            % paradas.length
        ];


    progresso += 0.04;


    if (progresso >= 1) {

        progresso = 0;

        indiceAtual++;

        if (
            indiceAtual >=
            paradas.length
        ) {

            indiceAtual = 0;

        }

    }


    const lat =
        atual.lat +
        (
            proxima.lat -
            atual.lat
        ) * progresso;


    const lng =
        atual.lng +
        (
            proxima.lng -
            atual.lng
        ) * progresso;


    marcadorOnibus.setLatLng([
        lat,
        lng
    ]);


    atualizarInformacoes();

}


/* =====================================================
   ATUALIZAR INFORMAÇÕES
===================================================== */

function atualizarInformacoes() {

    if (!rotaAtual) return;


    const paradas =
        rotaAtual.paradas;


    const proximoIndice =
        (indiceAtual + 1)
        % paradas.length;


    const proxima =
        paradas[proximoIndice];


    proximaParada.textContent =
        proxima.nome;


    const distancia =
        calcularDistancia(
            marcadorOnibus
                ? marcadorOnibus.getLatLng().lat
                : paradas[indiceAtual].lat,

            marcadorOnibus
                ? marcadorOnibus.getLatLng().lng
                : paradas[indiceAtual].lng,

            proxima.lat,
            proxima.lng
        );


    const velocidade =
        rotaAtual.velocidade;


    const minutos =
        Math.max(
            1,
            Math.ceil(
                (distancia / velocidade) * 60
            )
        );


    tempoChegada.textContent =
        `${minutos} min`;


    statusOnibus.textContent =
        `Em movimento • ${Math.round(
            velocidade
        )} km/h`;


    const agora =
        new Date();


    ultimaAtualizacao.textContent =
        agora.toLocaleTimeString(
            "pt-BR"
        );


    atualizarListaParadas();

}


/* =====================================================
   LISTA DE PARADAS
===================================================== */

function atualizarListaParadas() {

    listaParadas.innerHTML = "";


    rotaAtual.paradas.forEach(
        (parada, index) => {

            let classe;

            let texto;


            if (index <= indiceAtual) {

                classe = "passou";

                texto = "Já passou";

            }

            else if (
                index ===
                indiceAtual + 1
            ) {

                classe = "proxima";

                texto = "Próxima parada";

            }

            else {

                classe = "futura";

                texto = "Ainda vai passar";

            }


            /*
             * Caso o ônibus esteja no
             * último trecho da rota.
             */

            if (
                indiceAtual ===
                rotaAtual.paradas.length - 1
                &&
                index === 0
            ) {

                classe = "proxima";

                texto = "Próxima parada";

            }


            const elemento =
                document.createElement("div");


            elemento.className =
                "parada-item";


            elemento.innerHTML = `

                <div class="numero-parada">
                    ${index + 1}
                </div>

                <div class="parada-info">

                    <strong>
                        ${parada.nome}
                    </strong>

                    <small>
                        Parada ${index + 1}
                    </small>

                </div>

                <span class="status ${classe}">
                    ${texto}
                </span>

            `;


            listaParadas.appendChild(
                elemento
            );

        }
    );

}


/* =====================================================
   CALCULAR DISTÂNCIA
   Fórmula de Haversine
===================================================== */

function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;


    const dLat =
        grausParaRad(
            lat2 - lat1
        );


    const dLon =
        grausParaRad(
            lon2 - lon1
        );


    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(
            grausParaRad(lat1)
        ) *

        Math.cos(
            grausParaRad(lat2)
        ) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;

}


/* =====================================================
   GRAUS → RADIANOS
===================================================== */

function grausParaRad(graus) {

    return graus *
        Math.PI /
        180;

}


/* =====================================================
   LIMPAR MAPA
===================================================== */

function limparMapa() {

    pararSimulacao();


    if (linhaMapa) {

        mapa.removeLayer(
            linhaMapa
        );

        linhaMapa = null;

    }


    if (marcadorOnibus) {

        mapa.removeLayer(
            marcadorOnibus
        );

        marcadorOnibus = null;

    }


    marcadoresParadas.forEach(
        marcador => {

            mapa.removeLayer(
                marcador
            );

        }
    );


    marcadoresParadas = [];


    rotaAtual = null;

    indiceAtual = 0;

    progresso = 0;


    nomeLinha.textContent =
        "Nenhuma linha selecionada";

    tipoLinha.textContent =
        "—";

    busId.textContent =
        "---";

    proximaParada.textContent =
        "—";

    tempoChegada.textContent =
        "—";

    statusOnibus.textContent =
        "Aguardando...";

    contadorParadas.textContent =
        "0 paradas";


    listaParadas.innerHTML = `

        <div class="sem-dados">

            Selecione uma linha
            para visualizar as paradas.

        </div>

    `;

}


/* =====================================================
   PARAR SIMULAÇÃO
===================================================== */

function pararSimulacao() {

    if (intervaloMovimento) {

        clearInterval(
            intervaloMovimento
        );

        intervaloMovimento = null;

    }

}
