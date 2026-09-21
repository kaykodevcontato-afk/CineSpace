/* =====================================================
   GAMEVOICE HUB
   SCRIPT.JS
===================================================== */


/* =====================================================
   DADOS DOS PRODUTOS
===================================================== */

const products = [

    {
        id: 1,
        title: "Voz de Policial Brasileiro",
        category: "voz",
        categoryName: "VOZ / DUBLAGEM",
        creator: "Lucas Almeida",
        icon: "👮",
        price: 19.90,
        rating: 4.9,
        description:
            "Voz masculina para policiais, agentes e personagens de ação.",
        audio: null
    },

    {
        id: 2,
        title: "Voz de NPC Jovem",
        category: "voz",
        categoryName: "VOZ / DUBLAGEM",
        creator: "Marina Costa",
        icon: "🗣️",
        price: 14.90,
        rating: 4.8,
        description:
            "Voz natural para personagens jovens e NPCs.",
        audio: null
    },

    {
        id: 3,
        title: "Narrador Cinematográfico",
        category: "voz",
        categoryName: "VOZ / DUBLAGEM",
        creator: "Rafael Souza",
        icon: "🎧",
        price: 29.90,
        rating: 5.0,
        description:
            "Voz para trailers, introduções e narrativas de games.",
        audio: null
    },

    {
        id: 4,
        title: "Personagem Masculino",
        category: "foto",
        categoryName: "FOTOGRAFIA",
        creator: "Studio Frame",
        icon: "👨",
        price: 24.90,
        rating: 4.7,
        description:
            "Pacote demonstrativo de fotografias para referência visual.",
        audio: null
    },

    {
        id: 5,
        title: "Personagem Feminino",
        category: "foto",
        categoryName: "FOTOGRAFIA",
        creator: "Studio Frame",
        icon: "👩",
        price: 24.90,
        rating: 4.9,
        description:
            "Fotos de referência para criação de personagens.",
        audio: null
    },

    {
        id: 6,
        title: "Expressões Faciais",
        category: "foto",
        categoryName: "FOTOGRAFIA",
        creator: "FaceLab",
        icon: "🎭",
        price: 34.90,
        rating: 4.8,
        description:
            "Coleção demonstrativa de expressões para referência.",
        audio: null
    },

    {
        id: 7,
        title: "Passos em Concreto",
        category: "audio",
        categoryName: "SOUND EFFECT",
        creator: "SoundLab BR",
        icon: "👟",
        price: 9.90,
        rating: 4.9,
        description:
            "Efeitos sonoros de passos para personagens.",
        audio: null
    },

    {
        id: 8,
        title: "Ambiente de Cidade",
        category: "audio",
        categoryName: "SOUND EFFECT",
        creator: "SoundLab BR",
        icon: "🌆",
        price: 12.90,
        rating: 4.7,
        description:
            "Ambiente urbano para mapas e cidades.",
        audio: null
    },

    {
        id: 9,
        title: "Floresta Noturna",
        category: "audio",
        categoryName: "AMBIENTE",
        creator: "Nature Audio",
        icon: "🌲",
        price: 16.90,
        rating: 5.0,
        description:
            "Ambiente de floresta para jogos de sobrevivência.",
        audio: null
    }

];


/* =====================================================
   CRIADORES
===================================================== */

const creators = [

    {
        name: "Lucas Almeida",
        role: "Voice Actor",
        location: "Pernambuco",
        icon: "👨‍🎤"
    },

    {
        name: "Marina Costa",
        role: "Dubladora",
        location: "São Paulo",
        icon: "👩‍🎤"
    },

    {
        name: "Studio Frame",
        role: "Fotografia",
        location: "Rio de Janeiro",
        icon: "📸"
    },

    {
        name: "SoundLab BR",
        role: "Sound Designer",
        location: "Minas Gerais",
        icon: "🎧"
    }

];


/* =====================================================
   ESTADO
===================================================== */

let currentCategory = "todos";

let selectedProduct = null;

let cart =
    JSON.parse(
        localStorage.getItem(
            "gamevoice_cart"
        )
    ) || [];

let favorites =
    JSON.parse(
        localStorage.getItem(
            "gamevoice_favorites"
        )
    ) || [];


/* =====================================================
   ELEMENTOS
===================================================== */

const productsGrid =
    document.getElementById(
        "productsGrid"
    );

const creatorGrid =
    document.getElementById(
        "creatorGrid"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchButton =
    document.getElementById(
        "searchButton"
    );

const sortSelect =
    document.getElementById(
        "sortSelect"
    );

const resultsCount =
    document.getElementById(
        "resultsCount"
    );

const emptyResults =
    document.getElementById(
        "emptyResults"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const favoriteCount =
    document.getElementById(
        "favoriteCount"
    );

const cartModal =
    document.getElementById(
        "cartModal"
    );

const productModal =
    document.getElementById(
        "productModal"
    );

const toast =
    document.getElementById(
        "toast"
    );


/* =====================================================
   FORMATAÇÃO
===================================================== */

function money(value) {

    return value.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =====================================================
   RENDER PRODUTOS
===================================================== */

function renderProducts() {

    const query =
        searchInput.value
            .toLowerCase()
            .trim();


    let filtered =
        products.filter(product => {

            const categoryMatch =
                currentCategory === "todos" ||
                product.category === currentCategory;


            const searchMatch =
                !query ||

                product.title
                    .toLowerCase()
                    .includes(query)

                ||

                product.description
                    .toLowerCase()
                    .includes(query)

                ||

                product.creator
                    .toLowerCase()
                    .includes(query)

                ||

                product.categoryName
                    .toLowerCase()
                    .includes(query);


            return (
                categoryMatch &&
                searchMatch
            );

        });


    /* ORDENAÇÃO */

    const sort =
        sortSelect.value;


    if (sort === "priceLow") {

        filtered.sort(
            (a,b) =>
                a.price - b.price
        );

    }


    if (sort === "priceHigh") {

        filtered.sort(
            (a,b) =>
                b.price - a.price
        );

    }


    if (sort === "rating") {

        filtered.sort(
            (a,b) =>
                b.rating - a.rating
        );

    }


    resultsCount.textContent =
        filtered.length + " assets";


    productsGrid.innerHTML = "";


    if (filtered.length === 0) {

        emptyResults.style.display =
            "block";

        return;

    }


    emptyResults.style.display =
        "none";


    filtered.forEach(
        product => {

            const isFavorite =
                favorites.includes(
                    product.id
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            card.innerHTML = `

                <div class="product-cover">

                    <span class="product-cover-icon">
                        ${product.icon}
                    </span>

                    <span class="product-badge">
                        ${product.categoryName}
                    </span>

                    <button
                        class="favorite-product ${
                            isFavorite
                                ? "active"
                                : ""
                        }"
                        onclick="toggleFavorite(${product.id})"
                    >
                        ${
                            isFavorite
                                ? "♥"
                                : "♡"
                        }
                    </button>

                </div>


                <div class="product-body">

                    <span class="product-creator">
                        ${product.creator}
                    </span>

                    <h3>
                        ${product.title}
                    </h3>

                    <p>
                        ${product.description}
                    </p>

                    <div class="product-rating">
                        ★★★★★
                        ${product.rating}
                    </div>


                    <div class="product-footer">

                        <div class="product-price">

                            <small>
                                A partir de
                            </small>

                            <strong>
                                ${money(product.price)}
                            </strong>

                        </div>


                        <div class="product-buttons">

                            <button
                                onclick="openProduct(${product.id})"
                            >
                                VER
                            </button>

                            <button
                                class="add"
                                onclick="addToCart(${product.id})"
                            >
                                + 🛒
                            </button>

                        </div>

                    </div>

                </div>

            `;


            productsGrid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   CATEGORIAS
===================================================== */

document
    .querySelectorAll(
        ".category-card"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".category-card"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                currentCategory =
                    button.dataset.category;


                renderProducts();

            }
        );

    });


/* =====================================================
   PESQUISA
===================================================== */

searchInput.addEventListener(
    "input",
    renderProducts
);


searchButton.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "explorar"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

        renderProducts();

    }
);


/* =====================================================
   BUSCAS POPULARES
===================================================== */

document
    .querySelectorAll(
        "[data-search]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                searchInput.value =
                    button.dataset.search;

                currentCategory =
                    "todos";


                document
                    .querySelectorAll(
                        ".category-card"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                document
                    .querySelector(
                        '[data-category="todos"]'
                    )
                    .classList.add(
                        "active"
                    );


                renderProducts();


                document
                    .getElementById(
                        "explorar"
                    )
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* =====================================================
   ORDENAÇÃO
===================================================== */

sortSelect.addEventListener(
    "change",
    renderProducts
);


/* =====================================================
   FAVORITOS
===================================================== */

function toggleFavorite(id) {

    if (
        favorites.includes(id)
    ) {

        favorites =
            favorites.filter(
                item => item !== id
            );

        showToast(
            "Removido dos favoritos."
        );

    } else {

        favorites.push(id);

        showToast(
            "♡ Adicionado aos favoritos."
        );

    }


    localStorage.setItem(
        "gamevoice_favorites",
        JSON.stringify(
            favorites
        )
    );


    updateCounters();

    renderProducts();

}


document
    .getElementById(
        "favoritesButton"
    )
    .addEventListener(
        "click",
        () => {

            if (
                favorites.length === 0
            ) {

                showToast(
                    "Você ainda não possui favoritos."
                );

                return;

            }


            searchInput.value = "";


            const favoriteProducts =
                products.filter(
                    product =>
                        favorites.includes(
                            product.id
                        )
                );


            productsGrid.innerHTML = "";


            favoriteProducts.forEach(
                product => {

                    const card =
                        document.createElement(
                            "article"
                        );

                    card.className =
                        "product-card";


                    card.innerHTML = `

                        <div class="product-cover">

                            <span class="product-cover-icon">
                                ${product.icon}
                            </span>

                        </div>

                        <div class="product-body">

                            <span class="product-creator">
                                ${product.creator}
                            </span>

                            <h3>
                                ${product.title}
                            </h3>

                            <p>
                                ${product.description}
                            </p>

                            <div class="product-footer">

                                <div class="product-price">

                                    <strong>
                                        ${money(product.price)}
                                    </strong>

                                </div>

                                <div class="product-buttons">

                                    <button
                                        onclick="openProduct(${product.id})"
                                    >
                                        VER
                                    </button>

                                    <button
                                        class="add"
                                        onclick="addToCart(${product.id})"
                                    >
                                        + 🛒
                                    </button>

                                </div>

                            </div>

                        </div>

                    `;


                    productsGrid.appendChild(
                        card
                    );

                }
            );


            resultsCount.textContent =
                favorites.length +
                " favoritos";


            emptyResults.style.display =
                "none";


            document
                .getElementById(
                    "explorar"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* =====================================================
   ABRIR PRODUTO
===================================================== */

function openProduct(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    selectedProduct =
        product;


    document.getElementById(
        "modalImage"
    ).textContent =
        product.icon;


    document.getElementById(
        "modalCategory"
    ).textContent =
        product.categoryName;


    document.getElementById(
        "modalTitle"
    ).textContent =
        product.title;


    document.getElementById(
        "modalRating"
    ).textContent =
        `★★★★★ ${product.rating}`;


    document.getElementById(
        "modalDescription"
    ).textContent =
        product.description;


    document.getElementById(
        "modalPrice"
    ).textContent =
        money(product.price);


    const audio =
        document.getElementById(
            "modalAudio"
        );


    if (product.audio) {

        audio.innerHTML = `

            <audio controls>

                <source
                    src="${product.audio}"
                    type="audio/mpeg"
                >

                Seu navegador não suporta áudio.

            </audio>

        `;

    } else {

        audio.innerHTML = `

            <div
                style="
                    padding:12px;
                    border:1px solid rgba(255,255,255,.08);
                    border-radius:9px;
                    color:#929baa;
                    font-size:11px;
                "
            >
                🎧 Demo de áudio será adicionada
                quando o arquivo estiver disponível.
            </div>

        `;

    }


    productModal.classList.add(
        "active"
    );

}


/* =====================================================
   MODAL
===================================================== */

document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        button.dataset.close
                    )
                    .classList.remove(
                        "active"
                    );

            }
        );

    });


document
    .querySelectorAll(
        ".modal-overlay"
    )
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


/* =====================================================
   ADICIONAR AO CARRINHO
===================================================== */

function addToCart(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    if (
        cart.some(
            item =>
                item.id === id
        )
    ) {

        showToast(
            "Esse asset já está no carrinho."
        );

        return;

    }


    cart.push(
        product
    );


    saveCart();

    updateCounters();

    showToast(
        "🛒 Asset adicionado ao carrinho."
    );

}


/* =====================================================
   SALVAR CARRINHO
===================================================== */

function saveCart() {

    localStorage.setItem(
        "gamevoice_cart",
        JSON.stringify(
            cart
        )
    );

}


/* =====================================================
   CARRINHO
===================================================== */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    const empty =
        document.getElementById(
            "cartEmpty"
        );


    container.innerHTML = "";


    if (
        cart.length === 0
    ) {

        empty.style.display =
            "block";

        document.getElementById(
            "cartTotal"
        ).textContent =
            "R$ 0,00";

        return;

    }


    empty.style.display =
        "none";


    let total = 0;


    cart.forEach(
        product => {

            total +=
                product.price;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "cart-item";


            item.innerHTML = `

                <div class="cart-icon">
                    ${product.icon}
                </div>

                <div class="cart-item-info">

                    <strong>
                        ${product.title}
                    </strong>

                    <span>
                        ${money(product.price)}
                    </span>

                </div>

                <button
                    class="remove-cart"
                    onclick="removeFromCart(${product.id})"
                >
                    ×
                </button>

            `;


            container.appendChild(
                item
            );

        }
    );


    document.getElementById(
        "cartTotal"
    ).textContent =
        money(total);

}


/* =====================================================
   REMOVER
===================================================== */

function removeFromCart(id) {

    cart =
        cart.filter(
            product =>
                product.id !== id
        );


    saveCart();

    updateCounters();

    renderCart();

    showToast(
        "Asset removido."
    );

}


/* =====================================================
   ABRIR CARRINHO
===================================================== */

document
    .getElementById(
        "cartButton"
    )
    .addEventListener(
        "click",
        () => {

            renderCart();

            cartModal.classList.add(
                "active"
            );

        }
    );


/* =====================================================
   MODAL ADD
===================================================== */

document
    .getElementById(
        "modalAdd"
    )
    .addEventListener(
        "click",
        () => {

            if (!selectedProduct)
                return;


            addToCart(
                selectedProduct.id
            );


            productModal.classList.remove(
                "active"
            );

        }
    );


/* =====================================================
   CHECKOUT WHATSAPP
===================================================== */

document
    .getElementById(
        "checkoutButton"
    )
    .addEventListener(
        "click",
        () => {

            if (
                cart.length === 0
            ) {

                showToast(
                    "Seu carrinho está vazio."
                );

                return;

            }


            let total = 0;


            const items =
                cart.map(
                    product => {

                        total +=
                            product.price;

                        return (
                            `• ${product.title} — ` +
                            `${money(product.price)}`
                        );

                    }
                ).join("\n");


            const message =
                `Olá! Tenho interesse em comprar ` +
                `os seguintes assets do GameVoice Hub:\n\n` +
                `${items}\n\n` +
                `Total: ${money(total)}`;


            /*
                TROQUE PELO SEU NÚMERO.

                Formato:
                5587999999999

                Sem:
                +
                espaços
                parênteses
                hífen
            */

            const whatsapp =
                "5587999999999";


            const url =
                `https://wa.me/${whatsapp}?text=` +
                encodeURIComponent(
                    message
                );


            window.open(
                url,
                "_blank"
            );

        }
    );


/* =====================================================
   CONTADORES
===================================================== */

function updateCounters() {

    cartCount.textContent =
        cart.length;


    favoriteCount.textContent =
        favorites.length;

}


/* =====================================================
   CRIADORES
===================================================== */

function renderCreators() {

    creatorGrid.innerHTML = "";


    creators.forEach(
        creator => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "creator-card";


            card.innerHTML = `

                <div class="creator-avatar">
                    ${creator.icon}
                </div>

                <h3>
                    ${creator.name}
                </h3>

                <div class="creator-role">
                    ${creator.role}
                </div>

                <div class="creator-location">
                    📍 ${creator.location}
                </div>

                <button
                    onclick="showToast('Perfil do criador em desenvolvimento.')"
                >
                    Ver perfil
                </button>

            `;


            creatorGrid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   LEAFLET
===================================================== */

function initializeMap() {

    const mapElement =
        document.getElementById(
            "map"
        );


    if (!mapElement) return;


    /*
        Coordenadas aproximadas de cidades.
        Não são endereços pessoais.
    */

    const locations = [

        {
            name: "Arcoverde",
            state: "PE",
            lat: -8.4189,
            lng: -37.0561,
            assets: 8
        },

        {
            name: "Recife",
            state: "PE",
            lat: -8.0476,
            lng: -34.8770,
            assets: 15
        },

        {
            name: "São Paulo",
            state: "SP",
            lat: -23.5505,
            lng: -46.6333,
            assets: 24
        },

        {
            name: "Rio de Janeiro",
            state: "RJ",
            lat: -22.9068,
            lng: -43.1729,
            assets: 18
        },

        {
            name: "Belo Horizonte",
            state: "MG",
            lat: -19.9167,
            lng: -43.9345,
            assets: 11
        }

    ];


    /*
        Inicializa o mapa.
    */

    const map =
        L.map(
            mapElement,
            {
                zoomControl: true
            }
        );


    /*
        OpenStreetMap.
    */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(map);


    /*
        Cria os marcadores.
    */

    const bounds = [];


    locations.forEach(
        location => {

            const marker =
                L.marker([
                    location.lat,
                    location.lng
                ]).addTo(map);


            marker.bindPopup(`

                <strong>
                    ${location.name} - ${location.state}
                </strong>

                <br><br>

                🎮 ${location.assets} assets

                <br>

                👤 Criadores disponíveis

            `);


            bounds.push([
                location.lat,
                location.lng
            ]);

        }
    );


    /*
        Ajusta o mapa para mostrar todos
        os marcadores.
    */

    if (
        bounds.length > 0
    ) {

        map.fitBounds(
            bounds,
            {
                padding: [30,30]
            }
        );

    }


    /*
        Corrige mapas que ficam
        parcialmente cinza quando
        carregados dentro de elementos
        dinâmicos.
    */

    setTimeout(
        () => {

            map.invalidateSize();

        },
        300
    );

}


/* =====================================================
   BOTÃO CRIADOR
===================================================== */

document
    .getElementById(
        "creatorButton"
    )
    .addEventListener(
        "click",
        () => {

            showToast(
                "🚀 Cadastro de criadores em breve."
            );

        }
    );


/* =====================================================
   MENU MOBILE
===================================================== */

document
    .getElementById(
        "mobileMenu"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "mobileNav"
                )
                .classList.toggle(
                    "active"
                );

        }
    );


document
    .querySelectorAll(
        "#mobileNav a"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    document
                        .getElementById(
                            "mobileNav"
                        )
                        .classList.remove(
                            "active"
                        );

                }
            );

        }
    );


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   ANO
===================================================== */

document.getElementById(
    "year"
).textContent =
    new Date().getFullYear();


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

renderProducts();

renderCreators();

updateCounters();

initializeMap();
