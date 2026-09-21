/* =====================================================
   GAMEVOICE HUB
   SCRIPT.JS
===================================================== */


/* =====================================================
   PRODUTOS DE DEMONSTRAÇÃO
===================================================== */

const products = [

    {
        id: 1,
        title: "Voz de Soldado Brasileiro",
        category: "voz",
        categoryName: "Voz / Dublagem",
        icon: "🎙️",
        price: 19.90,
        description:
            "Pacote de falas para personagem militar ou policial em jogos.",
        audio: null
    },

    {
        id: 2,
        title: "Voz de NPC — Jovem",
        category: "voz",
        categoryName: "Voz / Dublagem",
        icon: "🗣️",
        price: 14.90,
        description:
            "Voz natural para diálogos de personagens jovens.",
        audio: null
    },

    {
        id: 3,
        title: "NPC — Perfil Masculino",
        category: "foto",
        categoryName: "Foto / Personagem",
        icon: "👨",
        price: 24.90,
        description:
            "Pacote demonstrativo de fotografias para criação visual de personagem.",
        audio: null
    },

    {
        id: 4,
        title: "NPC — Perfil Feminino",
        category: "foto",
        categoryName: "Foto / Personagem",
        icon: "👩",
        price: 24.90,
        description:
            "Fotos de referência para criação de personagens de games.",
        audio: null
    },

    {
        id: 5,
        title: "Sons de Cidade",
        category: "audio",
        categoryName: "Sound Effects",
        icon: "🌆",
        price: 12.90,
        description:
            "Ambiente urbano para mapas e cenários de jogos.",
        audio: null
    },

    {
        id: 6,
        title: "Pacote de Passos",
        category: "audio",
        categoryName: "Sound Effects",
        icon: "👟",
        price: 9.90,
        description:
            "Efeitos sonoros de passos para personagens.",
        audio: null
    },

    {
        id: 7,
        title: "Voz de Narrador",
        category: "voz",
        categoryName: "Voz / Dublagem",
        icon: "🎧",
        price: 29.90,
        description:
            "Voz para introduções, trailers e narrativas.",
        audio: null
    },

    {
        id: 8,
        title: "Ambiente Floresta",
        category: "audio",
        categoryName: "Sound Effects",
        icon: "🌲",
        price: 16.90,
        description:
            "Sons ambientes de floresta para jogos de aventura e sobrevivência.",
        audio: null
    },

    {
        id: 9,
        title: "Pack Personagem Completo",
        category: "foto",
        categoryName: "Personagem",
        icon: "🎭",
        price: 49.90,
        description:
            "Pacote demonstrativo com fotos e referências para um personagem.",
        audio: null
    }

];


/* =====================================================
   ESTADO
===================================================== */

let currentCategory = "todos";

let cart = JSON.parse(
    localStorage.getItem("gamevoiceCart")
) || [];

let selectedProduct = null;


/* =====================================================
   ELEMENTOS
===================================================== */

const productsGrid =
    document.getElementById("productsGrid");

const searchInput =
    document.getElementById("searchInput");

const noResults =
    document.getElementById("noResults");

const cartCount =
    document.getElementById("cartCount");

const cartModal =
    document.getElementById("cartModal");

const productModal =
    document.getElementById("productModal");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartTotal =
    document.getElementById("cartTotal");

const toast =
    document.getElementById("toast");


/* =====================================================
   FORMATAÇÃO DE PREÇO
===================================================== */

function formatPrice(value) {

    return value.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =====================================================
   MOSTRAR PRODUTOS
===================================================== */

function renderProducts() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filtered =
        products.filter(product => {

            const categoryMatch =
                currentCategory === "todos" ||
                product.category === currentCategory;


            const searchMatch =
                product.title
                    .toLowerCase()
                    .includes(search)
                ||
                product.description
                    .toLowerCase()
                    .includes(search);


            return categoryMatch && searchMatch;

        });


    productsGrid.innerHTML = "";


    if (filtered.length === 0) {

        noResults.style.display = "block";

        return;

    }


    noResults.style.display = "none";


    filtered.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                <span class="product-type">
                    ${product.categoryName}
                </span>

                ${product.icon}

            </div>


            <div class="product-content">

                <h3>
                    ${product.title}
                </h3>

                <p>
                    ${product.description}
                </p>


                <div class="product-bottom">

                    <strong class="price">
                        ${formatPrice(product.price)}
                    </strong>


                    <div class="product-actions">

                        <button
                            class="view-button"
                            onclick="openProduct(${product.id})"
                        >
                            VER
                        </button>


                        <button
                            class="add-button"
                            onclick="addToCart(${product.id})"
                        >
                            + 🛒
                        </button>

                    </div>

                </div>

            </div>

        `;


        productsGrid.appendChild(card);

    });

}


/* =====================================================
   CATEGORIAS
===================================================== */

document
    .querySelectorAll(".category-card")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category-card")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                button.classList.add("active");


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


/* =====================================================
   ABRIR PRODUTO
===================================================== */

function openProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    selectedProduct = product;


    document.getElementById(
        "modalImage"
    ).textContent = product.icon;


    document.getElementById(
        "modalCategory"
    ).textContent =
        product.categoryName;


    document.getElementById(
        "modalTitle"
    ).textContent =
        product.title;


    document.getElementById(
        "modalDescription"
    ).textContent =
        product.description;


    document.getElementById(
        "modalPrice"
    ).textContent =
        formatPrice(product.price);


    const player =
        document.getElementById(
            "modalPlayer"
        );


    if (product.audio) {

        player.innerHTML = `

            <audio controls>

                <source
                    src="${product.audio}"
                    type="audio/mpeg"
                >

                Seu navegador não suporta áudio.

            </audio>

        `;

    } else {

        player.innerHTML = `

            <div class="demo-message">

                🎧 Demonstração de áudio
                ainda não configurada.

            </div>

        `;

    }


    productModal.classList.add("active");

}


/* =====================================================
   FECHAR MODAIS
===================================================== */

document
    .querySelectorAll("[data-close]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modalId =
                    button.dataset.close;

                document
                    .getElementById(modalId)
                    .classList.remove("active");

            }
        );

    });


document
    .querySelectorAll(".modal-overlay")
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
            item => item.id === id
        );


    if (!product) return;


    const already =
        cart.find(
            item => item.id === id
        );


    if (already) {

        showToast(
            "Esse asset já está no carrinho."
        );

        return;

    }


    cart.push(product);


    saveCart();


    updateCart();


    showToast(
        "🎮 Asset adicionado ao carrinho!"
    );

}


/* =====================================================
   REMOVER DO CARRINHO
===================================================== */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();

    updateCart();

}


/* =====================================================
   ATUALIZAR CARRINHO
===================================================== */

function updateCart() {

    cartCount.textContent =
        cart.length;


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartEmpty.style.display =
            "block";

        cartTotal.textContent =
            "R$ 0,00";

        return;

    }


    cartEmpty.style.display =
        "none";


    let total = 0;


    cart.forEach(product => {

        total += product.price;


        const item =
            document.createElement("div");


        item.className =
            "cart-item";


        item.innerHTML = `

            <div class="cart-item-image">

                ${product.icon}

            </div>


            <div class="cart-item-info">

                <strong>
                    ${product.title}
                </strong>

                <small>
                    ${formatPrice(product.price)}
                </small>

            </div>


            <button
                class="remove-item"
                onclick="removeFromCart(${product.id})"
                title="Remover"
            >
                ×
            </button>

        `;


        cartItems.appendChild(item);

    });


    cartTotal.textContent =
        formatPrice(total);

}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveCart() {

    localStorage.setItem(
        "gamevoiceCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   ABRIR CARRINHO
===================================================== */

document
    .getElementById("openCart")
    .addEventListener(
        "click",
        () => {

            cartModal.classList.add(
                "active"
            );

        }
    );


/* =====================================================
   MODAL ADICIONAR
===================================================== */

document
    .getElementById("modalAdd")
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
   FINALIZAR COMPRA
===================================================== */

document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showToast(
                    "Seu carrinho está vazio."
                );

                return;

            }


            /*
                PROTÓTIPO

                Aqui futuramente você pode
                integrar Mercado Pago,
                Stripe, PagSeguro etc.
            */


            const items =
                cart
                    .map(
                        item =>
                            `• ${item.title} — ${formatPrice(item.price)}`
                    )
                    .join("\n");


            const total =
                cart.reduce(
                    (sum, item) =>
                        sum + item.price,
                    0
                );


            const message =
                `Olá! Quero comprar estes assets:\n\n` +
                `${items}\n\n` +
                `Total: ${formatPrice(total)}`;


            const whatsappNumber =
                "5587999999999";


            const url =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                encodeURIComponent(message);


            window.open(
                url,
                "_blank"
            );

        }
    );


/* =====================================================
   BOTÃO CRIADOR
===================================================== */

document
    .getElementById("creatorButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "🚀 Área de criadores em desenvolvimento."
            );

        }
    );


/* =====================================================
   TOAST
===================================================== */

let toastTimeout;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
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

updateCart();
