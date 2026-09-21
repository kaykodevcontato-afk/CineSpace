/* =========================================================
   GAMEASSETS MARKET
   Marketplace demonstrativo
   ========================================================= */


/* =========================================================
   DADOS DOS PRODUTOS
   ========================================================= */

const products = [
    {
        id: 1,
        title: "Voz Masculina — Soldado",
        category: "voz",
        categoryName: "VOZ",
        symbol: "🎙️",
        price: 39.90,
        creator: "Lucas Voice",
        location: "Recife - PE",
        gender: "masculina",
        description:
            "Voz masculina para personagens de ação, soldados, policiais e protagonistas de jogos.",
        tags: ["Masculina", "Ação", "Game"],
        voiceText:
            "Soldado, a área está segura. Podemos continuar a missão."
    },

    {
        id: 2,
        title: "Voz Feminina — Narradora",
        category: "voz",
        categoryName: "VOZ",
        symbol: "🎙️",
        price: 44.90,
        creator: "Ana Voice",
        location: "Caruaru - PE",
        gender: "feminina",
        description:
            "Voz feminina para narrativas, trailers, histórias e personagens.",
        tags: ["Feminina", "Narrativa", "Trailer"],
        voiceText:
            "A jornada está apenas começando. O destino deste mundo está em suas mãos."
    },

    {
        id: 3,
        title: "Dublagem — Personagem RPG",
        category: "dublagem",
        categoryName: "DUBLAGEM",
        symbol: "🎭",
        price: 59.90,
        creator: "Studio Nordeste",
        location: "Arcoverde - PE",
        gender: "masculina",
        description:
            "Pacote demonstrativo de falas para personagens de RPG e fantasia.",
        tags: ["RPG", "Fantasia", "Personagem"],
        voiceText:
            "Você chegou tarde, aventureiro. A cidade já está sendo atacada."
    },

    {
        id: 4,
        title: "Foto — Personagem Jovem",
        category: "foto",
        categoryName: "FOTO",
        symbol: "📸",
        price: 29.90,
        creator: "RealFace Studio",
        location: "São Paulo - SP",
        description:
            "Foto demonstrativa de pessoa real para composição de personagem.",
        tags: ["Pessoa", "Game", "Personagem"]
    },

    {
        id: 5,
        title: "Efeito Sonoro — Explosão",
        category: "audio",
        categoryName: "ÁUDIO",
        symbol: "💥",
        price: 14.90,
        creator: "FX Lab",
        location: "Recife - PE",
        description:
            "Efeito sonoro para explosões, combates e cenas de ação.",
        tags: ["FX", "Explosão", "Ação"]
    },

    {
        id: 6,
        title: "Voz Robótica — IA",
        category: "voz",
        categoryName: "VOZ",
        symbol: "🤖",
        price: 49.90,
        creator: "Cyber Voice",
        location: "São Paulo - SP",
        gender: "robotica",
        description:
            "Estilo de voz tecnológica para robôs, inteligência artificial e ficção científica.",
        tags: ["IA", "Robô", "Sci-Fi"],
        voiceText:
            "Sistema operacional iniciado. Todos os módulos estão funcionando normalmente."
    },

    {
        id: 7,
        title: "Ambiente — Cidade",
        category: "audio",
        categoryName: "ÁUDIO",
        symbol: "🏙️",
        price: 19.90,
        creator: "Sound City",
        location: "Recife - PE",
        description:
            "Ambiente sonoro urbano para jogos, vídeos e experiências digitais.",
        tags: ["Cidade", "Ambiente", "Game"]
    },

    {
        id: 8,
        title: "Foto — Personagem de Ação",
        category: "foto",
        categoryName: "FOTO",
        symbol: "📷",
        price: 34.90,
        creator: "Character Lab",
        location: "Caruaru - PE",
        description:
            "Material fotográfico demonstrativo para criação de personagens.",
        tags: ["Ação", "Pessoa", "Personagem"]
    }
];


/* =========================================================
   ESTADO
   ========================================================= */

let currentCategory = "todos";
let searchTerm = "";
let cart = [];
let selectedProduct = null;


/* =========================================================
   ELEMENTOS DOM
   Inicializados somente depois do HTML carregar
   ========================================================= */

let productsGrid = null;
let resultsCount = null;
let emptyState = null;

let searchInput = null;
let sortSelect = null;
let clearFilters = null;

let cartCount = null;
let cartItems = null;
let cartTotal = null;

let productModal = null;
let modalContent = null;
let closeModalButton = null;

let cartDrawer = null;
let cartBackdrop = null;
let openCartButton = null;
let closeCartButton = null;
let checkoutButton = null;


/* =========================================================
   FORMATAÇÃO
   ========================================================= */

function formatPrice(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   RENDER PRODUTOS
   ========================================================= */

function renderProducts() {

    if (!productsGrid || !resultsCount || !emptyState) {
        console.warn("Elementos da área de produtos não encontrados.");
        return;
    }

    let filtered = products.filter(product => {

        const categoryMatch =
            currentCategory === "todos" ||
            product.category === currentCategory;

        const searchText = `
            ${product.title}
            ${product.description}
            ${product.creator}
            ${product.location}
            ${product.tags.join(" ")}
        `.toLowerCase();

        const searchMatch =
            searchText.includes(searchTerm.toLowerCase());

        return categoryMatch && searchMatch;
    });


    /* =====================================================
       ORDENAÇÃO
       ===================================================== */

    const sort = sortSelect ? sortSelect.value : "default";

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
        filtered.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }


    resultsCount.textContent =
        `${filtered.length} asset${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`;

    productsGrid.innerHTML = "";


    if (filtered.length === 0) {

        emptyState.style.display = "block";
        return;

    }


    emptyState.style.display = "none";


    /* =====================================================
       CRIAR CARDS
       ===================================================== */

    filtered.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-visual">

                <span class="product-category">
                    ${escapeHTML(product.categoryName)}
                </span>

                <span class="product-symbol">
                    ${product.symbol}
                </span>

            </div>

            <div class="product-body">

                <h3>
                    ${escapeHTML(product.title)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-creator">
                    👤 ${escapeHTML(product.creator)}
                    · 📍 ${escapeHTML(product.location)}
                </div>

                <div class="product-bottom">

                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <div class="product-actions">

                        <button
                            type="button"
                            class="details-button"
                            title="Ver detalhes"
                            data-product-id="${product.id}"
                        >
                            👁
                        </button>

                        ${
                            product.voiceText
                                ? `
                                <button
                                    type="button"
                                    class="product-voice-button"
                                    title="Ouvir demonstração"
                                >
                                    ▶
                                </button>
                                `
                                : ""
                        }

                        <button
                            type="button"
                            class="buy"
                            title="Adicionar ao carrinho"
                            data-buy-id="${product.id}"
                        >
                            +
                        </button>

                    </div>

                </div>

            </div>
        `;


        productsGrid.appendChild(card);


        /* =================================================
           BOTÃO DETALHES
           ================================================= */

        const detailsButton =
            card.querySelector(".details-button");

        if (detailsButton) {

            detailsButton.addEventListener("click", () => {

                openProduct(product.id);

            });

        }


        /* =================================================
           BOTÃO DE VOZ
           ================================================= */

        const voiceButton =
            card.querySelector(".product-voice-button");

        if (voiceButton) {

            voiceButton.addEventListener("click", () => {

                ouvirVoz(
                    product.voiceText,
                    product.gender || "masculina"
                );

            });

        }


        /* =================================================
           BOTÃO COMPRAR
           ================================================= */

        const buyButton =
            card.querySelector("[data-buy-id]");

        if (buyButton) {

            buyButton.addEventListener("click", () => {

                addToCart(product.id);

            });

        }

    });

}


/* =========================================================
   CATEGORIAS
   ========================================================= */

function configurarCategorias() {

    document
        .querySelectorAll(".category-card")
        .forEach(button => {

            button.addEventListener("click", () => {

                document
                    .querySelectorAll(".category-card")
                    .forEach(item => {
                        item.classList.remove("active");
                    });

                button.classList.add("active");

                currentCategory =
                    button.dataset.category || "todos";

                renderProducts();

            });

        });

}


/* =========================================================
   BUSCA
   ========================================================= */

function configurarBusca() {

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", event => {

        searchTerm = event.target.value;

        renderProducts();

    });

}


/* =========================================================
   ORDENAÇÃO
   ========================================================= */

function configurarOrdenacao() {

    if (!sortSelect) {
        return;
    }

    sortSelect.addEventListener(
        "change",
        renderProducts
    );

}


/* =========================================================
   LIMPAR FILTROS
   ========================================================= */

function configurarLimparFiltros() {

    if (!clearFilters) {
        return;
    }

    clearFilters.addEventListener("click", () => {

        if (searchInput) {
            searchInput.value = "";
        }

        searchTerm = "";
        currentCategory = "todos";

        if (sortSelect) {
            sortSelect.value = "default";
        }

        document
            .querySelectorAll(".category-card")
            .forEach(item => {
                item.classList.remove("active");
            });

        const allCategory =
            document.querySelector(
                '[data-category="todos"]'
            );

        if (allCategory) {
            allCategory.classList.add("active");
        }

        renderProducts();

    });

}


/* =========================================================
   VOZES - SPEECH SYNTHESIS
   ========================================================= */

let availableVoices = [];


function carregarVozes() {

    if (!("speechSynthesis" in window)) {
        return;
    }

    availableVoices =
        window.speechSynthesis.getVoices();

    console.log(
        "Vozes disponíveis:",
        availableVoices.map(voice => ({
            nome: voice.name,
            idioma: voice.lang
        }))
    );

}


/* =========================================================
   INICIALIZAR SISTEMA DE VOZ
   ========================================================= */

function inicializarVozes() {

    if (!("speechSynthesis" in window)) {
        console.warn(
            "Speech Synthesis não disponível."
        );
        return;
    }

    carregarVozes();

    window.speechSynthesis.onvoiceschanged =
        carregarVozes;

}


/* =========================================================
   PROCURAR VOZ
   ========================================================= */

function procurarVoz(preferencias) {

    if (!availableVoices.length) {
        carregarVozes();
    }

    if (!availableVoices.length) {
        return null;
    }


    /* Primeiro procura pelos nomes desejados */

    for (const nome of preferencias) {

        const encontrada =
            availableVoices.find(voice => {

                const voiceName =
                    voice.name.toLowerCase();

                const voiceLang =
                    voice.lang.toLowerCase();

                return (
                    voiceName.includes(
                        nome.toLowerCase()
                    ) &&
                    voiceLang.startsWith("pt")
                );

            });

        if (encontrada) {
            return encontrada;
        }

    }


    /* Depois procura qualquer voz em português */

    return availableVoices.find(
        voice =>
            voice.lang &&
            voice.lang
                .toLowerCase()
                .startsWith("pt")
    ) || null;

}


/* =========================================================
   VOZ MASCULINA
   ========================================================= */

function escolherVozMasculina() {

    return procurarVoz([
        "Daniel",
        "Felipe",
        "Ricardo",
        "Guilherme",
        "João",
        "Joao",
        "Antonio",
        "Antônio",
        "Microsoft Daniel"
    ]);

}


/* =========================================================
   VOZ FEMININA
   ========================================================= */

function escolherVozFeminina() {

    return procurarVoz([
        "Maria",
        "Francisca",
        "Camila",
        "Ana",
        "Luciana",
        "Fernanda",
        "Mariana",
        "Microsoft Maria",
        "Microsoft Francisca"
    ]);

}


/* =========================================================
   VOZ ROBÓTICA
   ========================================================= */

function escolherVozRobotica() {

    return procurarVoz([
        "Daniel",
        "Felipe",
        "Maria",
        "Francisca",
        "Microsoft Daniel",
        "Microsoft Maria"
    ]);

}


/* =========================================================
   FALAR
   ========================================================= */

function ouvirVoz(texto, genero = "masculina") {

    if (!("speechSynthesis" in window)) {

        alert(
            "Seu navegador não possui suporte à demonstração de voz."
        );

        return;
    }


    if (!texto) {
        return;
    }


    carregarVozes();

    window.speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(texto);


    let voice = null;


    switch (genero) {

        case "feminina":

            voice =
                escolherVozFeminina();

            utterance.pitch = 1.25;
            utterance.rate = 0.92;

            break;


        case "robotica":

            voice =
                escolherVozRobotica();

            utterance.pitch = 0.55;
            utterance.rate = 0.82;

            break;


        case "masculina":

        default:

            voice =
                escolherVozMasculina();

            utterance.pitch = 0.80;
            utterance.rate = 0.90;

            break;

    }


    if (voice) {

        utterance.voice = voice;
        utterance.lang = voice.lang;

        console.log(
            "Demonstração:",
            genero,
            "| Voz:",
            voice.name,
            "| Idioma:",
            voice.lang
        );

    } else {

        utterance.lang = "pt-BR";

        console.warn(
            "Nenhuma voz específica encontrada para:",
            genero
        );

    }


    utterance.volume = 1;

    window.speechSynthesis.speak(
        utterance
    );

}


/* =========================================================
   PARAR VOZ
   ========================================================= */

function pararVoz() {

    if ("speechSynthesis" in window) {

        window.speechSynthesis.cancel();

    }

}


/* =========================================================
   BOTÕES DE DEMONSTRAÇÃO DE VOZ DO HTML
   ========================================================= */

function configurarBotoesDemoVoz() {

    document
        .querySelectorAll(".voice-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const texto =
                    button.dataset.text || "";

                let genero =
                    button.dataset.gender || "";

                if (!genero) {

                    const label =
                        button.textContent.toLowerCase();

                    if (
                        label.includes("feminina")
                    ) {
                        genero = "feminina";

                    } else if (
                        label.includes("robótica") ||
                        label.includes("robotica")
                    ) {
                        genero = "robotica";

                    } else {
                        genero = "masculina";
                    }

                }

                ouvirVoz(
                    texto,
                    genero
                );

            });

        });


    document
        .querySelectorAll(".stop-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                pararVoz
            );

        });

}


/* =========================================================
   MODAL
   ========================================================= */

function openProduct(id) {

    if (!productModal || !modalContent) {
        return;
    }

    selectedProduct =
        products.find(
            product => product.id === id
        );

    if (!selectedProduct) {
        return;
    }


    modalContent.innerHTML = `

        <div class="modal-product-symbol">
            ${selectedProduct.symbol}
        </div>

        <span class="eyebrow">
            ${escapeHTML(
                selectedProduct.categoryName
            )}
        </span>

        <h2>
            ${escapeHTML(
                selectedProduct.title
            )}
        </h2>

        <p class="modal-description">
            ${escapeHTML(
                selectedProduct.description
            )}
        </p>

        <p class="modal-description">
            👤 Criador:
            <strong>
                ${escapeHTML(
                    selectedProduct.creator
                )}
            </strong>
        </p>

        <p class="modal-description">
            📍 Localização aproximada:
            ${escapeHTML(
                selectedProduct.location
            )}
        </p>

        ${
            selectedProduct.voiceText
                ? `
                <button
                    type="button"
                    id="modalVoiceButton"
                    class="modal-buy"
                    style="
                        margin-top:15px;
                        background:#171f2d;
                        color:white;
                    "
                >
                    ▶ Ouvir demonstração
                </button>
                `
                : ""
        }

        <div class="modal-price">
            ${formatPrice(
                selectedProduct.price
            )}
        </div>

        <button
            type="button"
            id="modalAddCart"
            class="modal-buy"
        >
            🛒 Adicionar ao carrinho
        </button>

    `;


    productModal.classList.add("active");


    const modalVoiceButton =
        document.getElementById(
            "modalVoiceButton"
        );

    if (modalVoiceButton) {

        modalVoiceButton.addEventListener(
            "click",
            () => {

                ouvirVoz(
                    selectedProduct.voiceText,
                    selectedProduct.gender ||
                    "masculina"
                );

            }
        );

    }


    const modalAddCart =
        document.getElementById(
            "modalAddCart"
        );

    if (modalAddCart) {

        modalAddCart.addEventListener(
            "click",
            () => {

                addToCart(
                    selectedProduct.id
                );

                closeProductModal();

            }
        );

    }

}


/* =========================================================
   FECHAR MODAL
   ========================================================= */

function closeProductModal() {

    if (!productModal) {
        return;
    }

    productModal.classList.remove(
        "active"
    );

    pararVoz();

}


/* =========================================================
   CONFIGURAR MODAL
   ========================================================= */

function configurarModal() {

    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeProductModal
        );

    }


    if (productModal) {

        productModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === productModal
                ) {

                    closeProductModal();

                }

            }
        );

    }

}


/* =========================================================
   CARRINHO
   ========================================================= */

function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) {
        return;
    }


    const alreadyExists =
        cart.some(
            item => item.id === id
        );


    if (!alreadyExists) {

        cart.push(product);

    }


    updateCart();

    openCart();

}


/* =========================================================
   REMOVER CARRINHO
   ========================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    updateCart();

}


/* =========================================================
   ATUALIZAR CARRINHO
   ========================================================= */

function updateCart() {

    if (
        !cartCount ||
        !cartItems ||
        !cartTotal
    ) {
        return;
    }


    cartCount.textContent =
        cart.length;


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-empty">
                🛒
                <br><br>
                Seu carrinho está vazio.
            </div>
        `;

        cartTotal.textContent =
            formatPrice(0);

        return;

    }


    let total = 0;


    cart.forEach(product => {

        total += product.price;


        const item =
            document.createElement("div");

        item.className =
            "cart-item";


        item.innerHTML = `
            <div class="cart-item-symbol">
                ${product.symbol}
            </div>

            <div class="cart-item-info">

                <strong>
                    ${escapeHTML(
                        product.title
                    )}
                </strong>

                <span>
                    ${formatPrice(
                        product.price
                    )}
                </span>

            </div>

            <button
                type="button"
                class="cart-remove"
                data-remove-id="${product.id}"
            >
                ×
            </button>
        `;


        cartItems.appendChild(item);

    });


    cartItems
        .querySelectorAll("[data-remove-id]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    removeFromCart(
                        Number(
                            button.dataset.removeId
                        )
                    );

                }
            );

        });


    cartTotal.textContent =
        formatPrice(total);

}


/* =========================================================
   ABRIR CARRINHO
   ========================================================= */

function openCart() {

    if (!cartDrawer || !cartBackdrop) {
        return;
    }

    cartDrawer.classList.add(
        "active"
    );

    cartBackdrop.classList.add(
        "active"
    );

}


/* =========================================================
   FECHAR CARRINHO
   ========================================================= */

function closeCart() {

    if (!cartDrawer || !cartBackdrop) {
        return;
    }

    cartDrawer.classList.remove(
        "active"
    );

    cartBackdrop.classList.remove(
        "active"
    );

}


/* =========================================================
   CONFIGURAR CARRINHO
   ========================================================= */

function configurarCarrinho() {

    if (openCartButton) {

        openCartButton.addEventListener(
            "click",
            openCart
        );

    }


    if (closeCartButton) {

        closeCartButton.addEventListener(
            "click",
            closeCart
        );

    }


    if (cartBackdrop) {

        cartBackdrop.addEventListener(
            "click",
            closeCart
        );

    }

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function configurarCheckout() {

    if (!checkoutButton) {
        return;
    }

    checkoutButton.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert(
                    "Adicione pelo menos um asset ao carrinho."
                );

                return;
            }


            alert(
                "Checkout demonstrativo.\n\n" +
                "Em uma versão real, esta etapa poderá integrar " +
                "PIX, cartão, boleto e entrega automática dos arquivos."
            );

        }
    );

}


/* =========================================================
   MAPA LEAFLET
   ========================================================= */

function initMap() {

    const mapElement =
        document.getElementById("map");


    if (!mapElement) {
        return;
    }


    if (typeof L === "undefined") {

        mapElement.innerHTML = `
            <div style="
                height:100%;
                display:grid;
                place-items:center;
                padding:30px;
                text-align:center;
                color:#8d96a8;
                background:#101721;
            ">
                <div>

                    <strong style="color:white;">
                        Mapa indisponível
                    </strong>

                    <br><br>

                    O Leaflet não foi carregado.

                </div>
            </div>
        `;

        return;
    }


    const creators = [

        {
            name: "Lucas Voice",
            city: "Recife - PE",
            position: [-8.0476, -34.8770]
        },

        {
            name: "Studio Nordeste",
            city: "Arcoverde - PE",
            position: [-8.4189, -37.0539]
        },

        {
            name: "Ana Voice",
            city: "Caruaru - PE",
            position: [-8.2830, -35.9761]
        },

        {
            name: "Cyber Voice",
            city: "São Paulo - SP",
            position: [-23.5505, -46.6333]
        }

    ];


    const map =
        L.map("map", {
            scrollWheelZoom: false
        }).setView(
            [-12.5, -38.5],
            5
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }
    ).addTo(map);


    creators.forEach(creator => {

        const marker =
            L.marker(
                creator.position
            ).addTo(map);


        marker.bindPopup(`
            <div style="
                min-width:150px;
                color:#111;
            ">

                <strong>
                    ${escapeHTML(
                        creator.name
                    )}
                </strong>

                <br>

                <small>
                    ${escapeHTML(
                        creator.city
                    )}
                </small>

                <br><br>

                🎙️ Vozes
                <br>
                🎭 Dublagem
                <br>
                🎧 Áudios

            </div>
        `);

    });


    setTimeout(() => {

        map.invalidateSize();

    }, 300);

}


/* =========================================================
   VERIFICAR ELEMENTOS NECESSÁRIOS
   ========================================================= */

function verificarElementosDOM() {

    const elementosObrigatorios = {
        productsGrid,
        resultsCount,
        emptyState,
        searchInput,
        sortSelect,
        clearFilters,
        cartCount,
        cartItems,
        cartTotal,
        productModal,
        modalContent,
        cartDrawer,
        cartBackdrop
    };


    const ausentes =
        Object.entries(elementosObrigatorios)
            .filter(([, elemento]) => !elemento)
            .map(([nome]) => nome);


    if (ausentes.length > 0) {

        console.warn(
            "Elementos DOM não encontrados:",
            ausentes
        );

    }

}


/* =========================================================
   INICIALIZAÇÃO PRINCIPAL
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ================================================
           LOCALIZAR ELEMENTOS
           ================================================ */

        productsGrid =
            document.getElementById(
                "productsGrid"
            );

        resultsCount =
            document.getElementById(
                "resultsCount"
            );

        emptyState =
            document.getElementById(
                "emptyState"
            );


        searchInput =
            document.getElementById(
                "searchInput"
            );

        sortSelect =
            document.getElementById(
                "sortSelect"
            );

        clearFilters =
            document.getElementById(
                "clearFilters"
            );


        cartCount =
            document.getElementById(
                "cartCount"
            );

        cartItems =
            document.getElementById(
                "cartItems"
            );

        cartTotal =
            document.getElementById(
                "cartTotal"
            );


        productModal =
            document.getElementById(
                "productModal"
            );

        modalContent =
            document.getElementById(
                "modalContent"
            );

        closeModalButton =
            document.getElementById(
                "closeModal"
            );


        cartDrawer =
            document.getElementById(
                "cartDrawer"
            );

        cartBackdrop =
            document.getElementById(
                "cartBackdrop"
            );

        openCartButton =
            document.getElementById(
                "openCart"
            );

        closeCartButton =
            document.getElementById(
                "closeCart"
            );

        checkoutButton =
            document.getElementById(
                "checkoutButton"
            );


        /* ================================================
           VERIFICAÇÃO
           ================================================ */

        verificarElementosDOM();


        /* ================================================
           CONFIGURAÇÕES
           ================================================ */

        configurarCategorias();

        configurarBusca();

        configurarOrdenacao();

        configurarLimparFiltros();

        configurarModal();

        configurarCarrinho();

        configurarCheckout();

        configurarBotoesDemoVoz();

        inicializarVozes();


        /* ================================================
           INICIALIZAÇÃO
           ================================================ */

        renderProducts();

        updateCart();

        initMap();


        console.log(
            "GameAssets Market iniciado com sucesso."
        );

    }
);

