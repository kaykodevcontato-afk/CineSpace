/* =========================================================
ALIEN WATCH PARTY V2
Supabase + GitHub Pages
========================================================= */

/* =========================================================
CONFIGURAÇÃO
========================================================= */

const SUPABASE_URL =
"https://ilenxaiiigqjmuannbdz.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpbGVueGFpaWlpcWptdWFubmJkeiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzkwMjE4MTQ0LCJleHAiOjIxMDU3OTQxNDR9.EGTWxgdSEFCY_tUpdG6Q9Jdnv_mTJbD784CgUmCSMtw";

/* =========================================================
SUPABASE
========================================================= */

let supabaseClient = null;

try {

```
if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

    console.log(
        "✅ Supabase inicializado."
    );

} else {

    console.error(
        "❌ Biblioteca Supabase não encontrada."
    );

}
```

} catch (error) {

```
console.error(
    "❌ Erro ao inicializar Supabase:",
    error
);
```

}

/* =========================================================
ESTADO
========================================================= */

const state = {

```
userId: null,
userName: "",

room: null,
roomId: null,

isHost: false,

participants: [],
playlist: [],

currentVideoId: null,

channel: null,

heartbeat: null,

ignoreVideoEvent: false,

initialized: false,

openingRoom: false,

buttonsInitialized: false,

creatingRoom: false,

joiningRoom: false
```

};

/* =========================================================
DOM
========================================================= */

const $ = id =>
document.getElementById(id);

let homeScreen;
let roomScreen;

let videoPlayer;
let videoPlaceholder;

let playlist;
let participants;
let chatMessages;

let showCreateRoom;
let showJoinRoom;

let createPanel;
let joinPanel;

let createName;
let roomName;
let roomPrivate;

let createRoomBtn;
let createError;

let joinName;
let roomCode;

let joinRoomBtn;
let joinError;

let leaveRoomBtn;
let copyRoomLink;

let showAddVideo;
let videoModal;
let addVideoBtn;

let videoTitle;
let videoUrl;
let videoError;

let chatForm;
let chatInput;

let connectionDot;
let connectionText;

let roomTitle;
let roomCodeDisplay;

let participantCount;
let hostStatus;

let toastElement;

/* =========================================================
ATUALIZAR DOM
========================================================= */

function refreshDOM() {

```
homeScreen = $("homeScreen");
roomScreen = $("roomScreen");

videoPlayer = $("videoPlayer");
videoPlaceholder = $("videoPlaceholder");

playlist = $("playlist");
participants = $("participants");
chatMessages = $("chatMessages");

showCreateRoom = $("showCreateRoom");
showJoinRoom = $("showJoinRoom");

createPanel = $("createPanel");
joinPanel = $("joinPanel");

createName = $("createName");
roomName = $("roomName");
roomPrivate = $("roomPrivate");

createRoomBtn = $("createRoomBtn");
createError = $("createError");

joinName = $("joinName");
roomCode = $("roomCode");

joinRoomBtn = $("joinRoomBtn");
joinError = $("joinError");

leaveRoomBtn = $("leaveRoomBtn");
copyRoomLink = $("copyRoomLink");

showAddVideo = $("showAddVideo");
videoModal = $("videoModal");
addVideoBtn = $("addVideoBtn");

videoTitle = $("videoTitle");
videoUrl = $("videoUrl");
videoError = $("videoError");

chatForm = $("chatForm");
chatInput = $("chatInput");

connectionDot = $("connectionDot");
connectionText = $("connectionText");

roomTitle = $("roomTitle");
roomCodeDisplay = $("roomCodeDisplay");

participantCount = $("participantCount");
hostStatus = $("hostStatus");

toastElement = $("toast");

console.log(
    "🔎 DOM:",
    {
        showCreateRoom: !!showCreateRoom,
        createRoomBtn: !!createRoomBtn,
        showJoinRoom: !!showJoinRoom,
        joinRoomBtn: !!joinRoomBtn,
        createName: !!createName,
        roomName: !!roomName
    }
);
```

}

/* =========================================================
LOG
========================================================= */

function log(...args) {

```
console.log(
    "[Alien Watch Party]",
    ...args
);
```

}

/* =========================================================
MOSTRAR / ESCONDER
========================================================= */

function showElement(element) {

```
if (!element) {
    return;
}

element.classList.remove("hidden");
```

}

function hideElement(element) {

```
if (!element) {
    return;
}

element.classList.add("hidden");
```

}

/* =========================================================
TEXTO
========================================================= */

function setText(element, text) {

```
if (element) {

    element.textContent =
        text ?? "";

}
```

}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHtml(text) {

```
const div =
    document.createElement("div");

div.textContent =
    text ?? "";

return div.innerHTML;
```

}

/* =========================================================
ERROS
========================================================= */

function showError(element, message) {

```
if (!element) {

    console.error(
        "Elemento de erro não encontrado:",
        message
    );

    return;

}

element.textContent =
    message || "Erro.";

element.style.display = "";
```

}

function clearError(element) {

```
if (!element) {
    return;
}

element.textContent = "";

element.style.display = "none";
```

}

/* =========================================================
TOAST
========================================================= */

function showToast(message) {

```
if (!toastElement) {

    console.log(
        "Toast:",
        message
    );

    return;

}

toastElement.textContent =
    message;

toastElement.classList.add("show");

clearTimeout(
    showToast.timer
);

showToast.timer =
    setTimeout(
        () => {

            toastElement.classList.remove(
                "show"
            );

        },
        3000
    );
```

}

/* =========================================================
STATUS
========================================================= */

function setConnectionStatus(
type,
text
) {

```
setText(
    connectionText,
    text
);

if (!connectionDot) {
    return;
}

connectionDot.classList.remove(
    "connected",
    "connecting",
    "error"
);

if (
    type === "connected" ||
    type === "connecting" ||
    type === "error"
) {

    connectionDot.classList.add(
        type
    );

}
```

}

/* =========================================================
INIT
========================================================= */

if (
document.readyState ===
"loading"
) {

```
document.addEventListener(
    "DOMContentLoaded",
    init,
    {
        once: true
    }
);
```

} else {

```
init();
```

}

async function init() {

```
if (state.initialized) {
    return;
}

state.initialized = true;

log(
    "🚀 Inicializando..."
);

refreshDOM();

setupButtons();

setConnectionStatus(
    "connecting",
    "Conectando..."
);

if (!supabaseClient) {

    setConnectionStatus(
        "error",
        "Supabase indisponível"
    );

    showToast(
        "❌ Supabase não carregou."
    );

    return;

}

try {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();

    if (error) {

        console.warn(
            "Erro ao recuperar sessão:",
            error
        );

    }

    if (
        data?.session?.user?.id
    ) {

        state.userId =
            data.session.user.id;

        log(
            "👤 Sessão encontrada:",
            state.userId
        );

    }

} catch (error) {

    console.warn(
        "Erro ao verificar sessão:",
        error
    );

}

checkRoomFromURL();

setConnectionStatus(
    "connected",
    "Online"
);

log(
    "✅ Aplicação pronta."
);
```

}

/* =========================================================
BOTÕES
========================================================= */

function setupButtons() {

```
if (state.buttonsInitialized) {
    return;
}

state.buttonsInitialized = true;

log(
    "🔧 Configurando botões..."
);


/* -----------------------------------------------------
   CRIAR
----------------------------------------------------- */

if (showCreateRoom) {

    showCreateRoom.addEventListener(
        "click",
        event => {

            event.preventDefault();

            log(
                "🟢 BOTÃO CRIAR SALA CLICADO"
            );

            showElement(
                createPanel
            );

            hideElement(
                joinPanel
            );

            clearError(
                createError
            );

            setTimeout(
                () => createName?.focus(),
                50
            );

        }
    );

}


/* -----------------------------------------------------
   ENTRAR
----------------------------------------------------- */

if (showJoinRoom) {

    showJoinRoom.addEventListener(
        "click",
        event => {

            event.preventDefault();

            log(
                "🟢 BOTÃO ENTRAR CLICADO"
            );

            showElement(
                joinPanel
            );

            hideElement(
                createPanel
            );

            clearError(
                joinError
            );

            setTimeout(
                () => joinName?.focus(),
                50
            );

        }
    );

}


/* -----------------------------------------------------
   CRIAR SALA
----------------------------------------------------- */

if (createRoomBtn) {

    createRoomBtn.type =
        "button";

    createRoomBtn.addEventListener(
        "click",
        async event => {

            event.preventDefault();

            log(
                "🚀 BOTÃO createRoomBtn CLICADO"
            );

            await createRoom();

        }
    );

} else {

    console.error(
        "❌ #createRoomBtn não encontrado."
    );

}


/* -----------------------------------------------------
   ENTRAR NA SALA
----------------------------------------------------- */

if (joinRoomBtn) {

    joinRoomBtn.type =
        "button";

    joinRoomBtn.addEventListener(
        "click",
        async event => {

            event.preventDefault();

            log(
                "🚪 BOTÃO joinRoomBtn CLICADO"
            );

            await joinRoom();

        }
    );

}


/* -----------------------------------------------------
   FECHAR MODAIS
----------------------------------------------------- */

document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(
        button => {

            button.type =
                "button";

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const targetId =
                        button.dataset.close;

                    const target =
                        document.getElementById(
                            targetId
                        );

                    hideElement(
                        target
                    );

                }
            );

        }
    );


/* -----------------------------------------------------
   SAIR
----------------------------------------------------- */

leaveRoomBtn?.addEventListener(
    "click",
    async event => {

        event.preventDefault();

        await leaveRoom();

    }
);


/* -----------------------------------------------------
   COPIAR
----------------------------------------------------- */

copyRoomLink?.addEventListener(
    "click",
    async event => {

        event.preventDefault();

        await copyRoomURL();

    }
);


/* -----------------------------------------------------
   ADICIONAR VÍDEO
----------------------------------------------------- */

showAddVideo?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        showElement(
            videoModal
        );

        videoTitle?.focus();

    }
);


addVideoBtn?.addEventListener(
    "click",
    async event => {

        event.preventDefault();

        await addVideo();

    }
);


/* -----------------------------------------------------
   CHAT
----------------------------------------------------- */

chatForm?.addEventListener(
    "submit",
    sendMessage
);


/* -----------------------------------------------------
   REAÇÕES
----------------------------------------------------- */

document
    .querySelectorAll(
        "[data-reaction]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    sendReaction(
                        button.dataset.reaction
                    );

                }
            );

        }
    );


/* -----------------------------------------------------
   ENTER
----------------------------------------------------- */

createName?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            createRoom();

        }

    }
);


roomName?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            createRoom();

        }

    }
);


joinName?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            joinRoom();

        }

    }
);


roomCode?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            joinRoom();

        }

    }
);


/* -----------------------------------------------------
   PLAYER
----------------------------------------------------- */

videoPlayer?.addEventListener(
    "play",
    handleVideoPlay
);

videoPlayer?.addEventListener(
    "pause",
    handleVideoPause
);

videoPlayer?.addEventListener(
    "seeked",
    handleVideoSeek
);


log(
    "✅ Botões configurados."
);
```

}

/* =========================================================
AUTENTICAÇÃO
========================================================= */

async function ensureUser() {

```
if (!supabaseClient) {

    throw new Error(
        "Supabase não está inicializado."
    );

}

const {
    data: sessionData,
    error: sessionError
} =
    await supabaseClient
        .auth
        .getSession();

if (sessionError) {

    throw new Error(
        sessionError.message
    );

}

const sessionUser =
    sessionData?.session?.user;

if (sessionUser?.id) {

    state.userId =
        sessionUser.id;

    return state.userId;

}

log(
    "🔐 Criando sessão anônima..."
);

const {
    data,
    error
} =
    await supabaseClient
        .auth
        .signInAnonymously();

if (error) {

    console.error(
        "❌ Login anônimo:",
        error
    );

    const lower =
        (
            error.message ||
            ""
        ).toLowerCase();

    if (
        lower.includes("anonymous") ||
        lower.includes("disabled")
    ) {

        throw new Error(
            "O Login Anônimo está desativado no Supabase. Ative Authentication → Providers → Anonymous."
        );

    }

    throw new Error(
        error.message ||
        "Não foi possível autenticar."
    );

}

if (!data?.user?.id) {

    throw new Error(
        "Supabase não retornou o usuário."
    );

}

state.userId =
    data.user.id;

log(
    "✅ Usuário anônimo:",
    state.userId
);

return state.userId;
```

}

/* =========================================================
CÓDIGO DA SALA
========================================================= */

function generateRoomCode(length = 6) {

```
const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let code = "";

for (
    let i = 0;
    i < length;
    i++
) {

    code +=
        characters.charAt(
            Math.floor(
                Math.random() *
                characters.length
            )
        );

}

return code;
```

}

/* =========================================================
CRIAR SALA
========================================================= */

async function createRoom() {

```
if (state.creatingRoom) {
    return;
}

state.creatingRoom = true;

refreshDOM();

clearError(
    createError
);

const name =
    createName?.value
        ?.trim() || "";

const roomNameValue =
    roomName?.value
        ?.trim() || "";

log(
    "🚀 createRoom() iniciado",
    {
        name,
        roomName: roomNameValue
    }
);


if (!name) {

    showError(
        createError,
        "Digite seu nome."
    );

    createName?.focus();

    state.creatingRoom = false;

    return;

}


if (!roomNameValue) {

    showError(
        createError,
        "Digite o nome da sala."
    );

    roomName?.focus();

    state.creatingRoom = false;

    return;

}


try {

    if (createRoomBtn) {

        createRoomBtn.disabled =
            true;

        createRoomBtn.textContent =
            "Criando...";

    }

    setConnectionStatus(
        "connecting",
        "Autenticando..."
    );


    /* -------------------------------------------------
       USUÁRIO
    ------------------------------------------------- */

    await ensureUser();


    /* -------------------------------------------------
       INSERT ROOM
    ------------------------------------------------- */

    setConnectionStatus(
        "connecting",
        "Criando sala..."
    );

    let room = null;
    let lastError = null;

    for (
        let attempt = 1;
        attempt <= 5;
        attempt++
    ) {

        const code =
            generateRoomCode();

        log(
            `🔑 Código ${attempt}/5:`,
            code
        );

        const {
            data,
            error
        } =
            await supabaseClient
                .from("rooms")
                .insert({

                    name:
                        roomNameValue,

                    code:
                        code,

                    owner_id:
                        state.userId,

                    is_private:
                        roomPrivate?.checked ??
                        false,

                    is_active:
                        true

                })
                .select("*")
                .single();

        if (!error) {

            room =
                data;

            break;

        }

        lastError =
            error;

        console.error(
            "❌ Erro INSERT rooms:",
            error
        );

        if (
            error.code ===
            "23505"
        ) {

            continue;

        }

        break;

    }


    if (!room) {

        console.error(
            "❌ ERRO FINAL:",
            lastError
        );

        const errorCode =
            lastError?.code || "";

        const message =
            lastError?.message ||
            "Não foi possível criar a sala.";

        if (
            errorCode ===
            "42501"
        ) {

            throw new Error(
                "Permissão negada pelo RLS. Verifique a política rooms_insert no Supabase."
            );

        }

        if (
            errorCode ===
            "23505"
        ) {

            throw new Error(
                "O código da sala já existe. Tente novamente."
            );

        }

        throw new Error(
            message
        );

    }


    /* -------------------------------------------------
       ESTADO
    ------------------------------------------------- */

    state.userName =
        name;

    state.room =
        room;

    state.roomId =
        room.id;

    state.isHost =
        true;


    log(
        "🏠 SALA CRIADA:",
        room
    );


    /* -------------------------------------------------
       MEMBRO
    ------------------------------------------------- */

    setConnectionStatus(
        "connecting",
        "Entrando na sala..."
    );

    await addMember();


    /* -------------------------------------------------
       SALA
    ------------------------------------------------- */

    await openRoom();


    setConnectionStatus(
        "connected",
        "Online"
    );

    hideElement(
        createPanel
    );

    showToast(
        "🎉 Sala criada com sucesso!"
    );


} catch (error) {

    console.error(
        "❌ ERRO AO CRIAR SALA:",
        error
    );

    showError(
        createError,
        error?.message ||
        "Erro ao criar sala."
    );

    setConnectionStatus(
        "error",
        "Erro"
    );


} finally {

    state.creatingRoom =
        false;

    if (createRoomBtn) {

        createRoomBtn.disabled =
            false;

        createRoomBtn.textContent =
            "Criar sala";

    }

}
```

}

/* =========================================================
ENTRAR NA SALA
========================================================= */

async function joinRoom() {

```
if (state.joiningRoom) {
    return;
}

state.joiningRoom = true;

refreshDOM();

clearError(
    joinError
);

const name =
    joinName?.value
        ?.trim() || "";

const code =
    roomCode?.value
        ?.trim()
        .toUpperCase() || "";


if (!name) {

    showError(
        joinError,
        "Digite seu nome."
    );

    joinName?.focus();

    state.joiningRoom = false;

    return;

}


if (!code) {

    showError(
        joinError,
        "Digite o código da sala."
    );

    roomCode?.focus();

    state.joiningRoom = false;

    return;

}


if (
    code.length !== 6
) {

    showError(
        joinError,
        "O código da sala deve ter 6 caracteres."
    );

    roomCode?.focus();

    state.joiningRoom = false;

    return;

}


try {

    if (joinRoomBtn) {

        joinRoomBtn.disabled =
            true;

        joinRoomBtn.textContent =
            "Entrando...";

    }

    setConnectionStatus(
        "connecting",
        "Autenticando..."
    );

    await ensureUser();


    setConnectionStatus(
        "connecting",
        "Procurando sala..."
    );


    const {
        data: room,
        error
    } =
        await supabaseClient
            .from("rooms")
            .select("*")
            .eq(
                "code",
                code
            )
            .eq(
                "is_active",
                true
            )
            .maybeSingle();


    if (error) {

        throw new Error(
            error.message
        );

    }


    if (!room) {

        throw new Error(
            "Sala não encontrada ou encerrada."
        );

    }


    state.userName =
        name;

    state.room =
        room;

    state.roomId =
        room.id;

    state.isHost =
        room.owner_id ===
        state.userId;


    await addMember();

    await openRoom();


    setConnectionStatus(
        "connected",
        "Online"
    );

    hideElement(
        joinPanel
    );

    showToast(
        "🎬 Você entrou na sala!"
    );


} catch (error) {

    console.error(
        "❌ ERRO AO ENTRAR:",
        error
    );

    showError(
        joinError,
        error?.message ||
        "Erro ao entrar na sala."
    );

    setConnectionStatus(
        "error",
        "Erro"
    );


} finally {

    state.joiningRoom =
        false;

    if (joinRoomBtn) {

        joinRoomBtn.disabled =
            false;

        joinRoomBtn.textContent =
            "Entrar";

    }

}
```

}

/* =========================================================
ADICIONAR MEMBRO
========================================================= */

async function addMember() {

```
if (
    !state.roomId ||
    !state.userId
) {

    throw new Error(
        "Dados da sala ou usuário ausentes."
    );

}


const {
    data,
    error
} =
    await supabaseClient
        .from("room_members")
        .upsert(

            {

                room_id:
                    state.roomId,

                user_id:
                    state.userId,

                display_name:
                    state.userName,

                is_online:
                    true,

                last_seen:
                    new Date().toISOString()

            },

            {

                onConflict:
                    "room_id,user_id"

            }

        )
        .select("*")
        .single();


if (error) {

    console.error(
        "❌ ERRO room_members:",
        error
    );

    throw new Error(
        "Não foi possível entrar como participante: " +
        error.message
    );

}


log(
    "👤 Membro:",
    data
);
```

}

/* =========================================================
ABRIR SALA
========================================================= */

async function openRoom() {

```
if (state.openingRoom) {
    return;
}

state.openingRoom = true;

try {

    refreshDOM();

    hideElement(
        homeScreen
    );

    showElement(
        roomScreen
    );

    setText(
        roomTitle,
        state.room?.name ||
        "Sala"
    );

    setText(
        roomCodeDisplay,
        state.room?.code ||
        ""
    );

    setText(
        hostStatus,
        state.isHost
            ? "👑 Você é o anfitrião"
            : "👤 Participante"
    );

    await loadRoomData();

    await subscribeRealtime();

    startHeartbeat();

    setConnectionStatus(
        "connected",
        "Online"
    );

} catch (error) {

    console.error(
        "❌ ERRO AO ABRIR SALA:",
        error
    );

    showToast(
        "Erro ao carregar a sala."
    );

} finally {

    state.openingRoom = false;

}
```

}

/* =========================================================
DADOS
========================================================= */

async function loadRoomData() {

```
await Promise.all([
    loadParticipants(),
    loadPlaylist(),
    loadMessages()
]);
```

}

/* =========================================================
PARTICIPANTES
========================================================= */

async function loadParticipants() {

```
if (!state.roomId) {
    return;
}

const {
    data,
    error
} =
    await supabaseClient
        .from("room_members")
        .select("*")
        .eq(
            "room_id",
            state.roomId
        )
        .order(
            "created_at",
            {
                ascending: true
            }
        );

if (error) {

    console.error(
        "❌ Participantes:",
        error
    );

    return;

}

state.participants =
    data || [];

renderParticipants();
```

}

function renderParticipants() {

```
if (!participants) {
    return;
}

participants.innerHTML = "";

state.participants.forEach(
    member => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "participant-item";

        item.innerHTML = `

            <span class="participant-status ${
                member.is_online
                    ? "online"
                    : ""
            }"></span>

            <span class="participant-name">
                ${escapeHtml(
                    member.display_name
                )}
            </span>

        `;

        participants.appendChild(
            item
        );

    }
);

setText(
    participantCount,
    state.participants.length
);
```

}

/* =========================================================
PLAYLIST
========================================================= */

async function loadPlaylist() {

```
if (!state.roomId) {
    return;
}

const {
    data,
    error
} =
    await supabaseClient
        .from("playlist_items")
        .select("*")
        .eq(
            "room_id",
            state.roomId
        )
        .order(
            "position",
            {
                ascending: true
            }
        )
        .order(
            "created_at",
            {
                ascending: true
            }
        );

if (error) {

    console.error(
        "❌ Playlist:",
        error
    );

    return;

}

state.playlist =
    data || [];

renderPlaylist();

if (
    state.playlist.length &&
    !state.currentVideoId
) {

    loadVideo(
        state.playlist[0]
    );

}
```

}

function renderPlaylist() {

```
if (!playlist) {
    return;
}

playlist.innerHTML = "";

if (!state.playlist.length) {

    playlist.innerHTML =
        `
        <div class="empty-playlist">
            Nenhum vídeo adicionado.
        </div>
        `;

    return;

}

state.playlist.forEach(
    item => {

        const element =
            document.createElement(
                "div"
            );

        element.className =
            "playlist-item";

        if (
            item.id ===
            state.currentVideoId
        ) {

            element.classList.add(
                "active"
            );

        }

        element.innerHTML = `

            <div class="playlist-info">

                <strong>
                    ${escapeHtml(
                        item.title
                    )}
                </strong>

            </div>

            <button
                type="button"
                class="playlist-play"
                title="Reproduzir"
            >
                ▶
            </button>

            <button
                type="button"
                class="playlist-delete"
                title="Remover"
            >
                ×
            </button>

        `;

        element
            .querySelector(
                ".playlist-play"
            )
            ?.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    loadVideo(
                        item
                    );

                }
            );

        element
            .querySelector(
                ".playlist-delete"
            )
            ?.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    removePlaylistItem(
                        item
                    );

                }
            );

        playlist.appendChild(
            element
        );

    }
);
```

}

/* =========================================================
ADICIONAR VÍDEO
========================================================= */

async function addVideo() {

```
clearError(
    videoError
);

const title =
    videoTitle?.value
        ?.trim() || "";

const url =
    videoUrl?.value
        ?.trim() || "";

if (!title) {

    showError(
        videoError,
        "Digite o título do vídeo."
    );

    videoTitle?.focus();

    return;

}

if (!url) {

    showError(
        videoError,
        "Digite a URL do vídeo."
    );

    videoUrl?.focus();

    return;

}

if (
    !state.roomId ||
    !state.userId
) {

    showError(
        videoError,
        "Você não está em uma sala."
    );

    return;

}

try {

    const position =
        state.playlist.length;

    const {
        data,
        error
    } =
        await supabaseClient
            .from("playlist_items")
            .insert({

                room_id:
                    state.roomId,

                title:
                    title,

                video_url:
                    url,

                position:
                    position,

                added_by:
                    state.userId

            })
            .select("*")
            .single();

    if (error) {

        throw new Error(
            error.message
        );

    }

    if (data) {

        state.playlist.push(
            data
        );

    }

    renderPlaylist();

    if (
        !state.currentVideoId &&
        data
    ) {

        loadVideo(
            data
        );

    }

    if (videoTitle) {
        videoTitle.value = "";
    }

    if (videoUrl) {
        videoUrl.value = "";
    }

    hideElement(
        videoModal
    );

    showToast(
        "🎬 Vídeo adicionado!"
    );

} catch (error) {

    console.error(
        "❌ Vídeo:",
        error
    );

    showError(
        videoError,
        error.message
    );

}
```

}

/* =========================================================
REMOVER VÍDEO
========================================================= */

async function removePlaylistItem(item) {

```
if (!item?.id) {
    return;
}

try {

    const {
        error
    } =
        await supabaseClient
            .from("playlist_items")
            .delete()
            .eq(
                "id",
                item.id
            );

    if (error) {

        throw new Error(
            error.message
        );

    }

    state.playlist =
        state.playlist.filter(
            video =>
                video.id !==
                item.id
        );

    if (
        state.currentVideoId ===
        item.id
    ) {

        state.currentVideoId =
            null;

        if (
            state.playlist.length
        ) {

            loadVideo(
                state.playlist[0]
            );

        } else {

            videoPlayer?.pause();

            videoPlayer?.removeAttribute(
                "src"
            );

            videoPlayer?.load();

            hideElement(
                videoPlayer
            );

            showElement(
                videoPlaceholder
            );

        }

    }

    renderPlaylist();

    showToast(
        "Vídeo removido."
    );

} catch (error) {

    console.error(
        "❌ Remover vídeo:",
        error
    );

    showToast(
        "Não foi possível remover o vídeo."
    );

}
```

}

/* =========================================================
VÍDEO
========================================================= */

function loadVideo(item) {

```
if (!item) {
    return;
}

state.currentVideoId =
    item.id;

renderPlaylist();

if (!videoPlayer) {
    return;
}

hideElement(
    videoPlaceholder
);

showElement(
    videoPlayer
);

state.ignoreVideoEvent =
    true;

try {

    videoPlayer.src =
        item.video_url;

    videoPlayer.load();

} catch (error) {

    console.error(
        "❌ Carregar vídeo:",
        error
    );

}

setTimeout(
    () => {

        state.ignoreVideoEvent =
            false;

    },
    500
);
```

}

/* =========================================================
PLAYER EVENTS
========================================================= */

function handleVideoPlay() {

```
if (
    state.ignoreVideoEvent ||
    !state.channel
) {
    return;
}

broadcastPlayer(
    "play",
    {
        time:
            videoPlayer?.currentTime ||
            0
    }
);
```

}

function handleVideoPause() {

```
if (
    state.ignoreVideoEvent ||
    !state.channel
) {
    return;
}

broadcastPlayer(
    "pause",
    {
        time:
            videoPlayer?.currentTime ||
            0
    }
);
```

}

function handleVideoSeek() {

```
if (
    state.ignoreVideoEvent ||
    !state.channel
) {
    return;
}

broadcastPlayer(
    "seek",
    {
        time:
            videoPlayer?.currentTime ||
            0
    }
);
```

}

function broadcastPlayer(
action,
data = {}
) {

```
if (!state.channel) {
    return;
}

state.channel.send({

    type:
        "broadcast",

    event:
        "player",

    payload: {

        userId:
            state.userId,

        action:
            action,

        ...data

    }

});
```

}

async function applyPlayerEvent(
payload
) {

```
if (!payload) {
    return;
}

if (
    payload.userId ===
    state.userId
) {
    return;
}

if (!videoPlayer) {
    return;
}

state.ignoreVideoEvent =
    true;

try {

    if (
        typeof payload.time ===
        "number"
    ) {

        try {

            videoPlayer.currentTime =
                payload.time;

        } catch (_) {}

    }

    if (
        payload.action ===
        "play"
    ) {

        try {

            await videoPlayer.play();

        } catch (error) {

            console.warn(
                "Autoplay bloqueado:",
                error
            );

            showToast(
                "Clique no vídeo para iniciar."
            );

        }

    }

    if (
        payload.action ===
        "pause"
    ) {

        videoPlayer.pause();

    }

} finally {

    setTimeout(
        () => {

            state.ignoreVideoEvent =
                false;

        },
        300
    );

}
```

}

/* =========================================================
REALTIME
========================================================= */

async function subscribeRealtime() {

```
if (
    !supabaseClient ||
    !state.roomId
) {
    return;
}

if (state.channel) {

    try {

        await supabaseClient
            .removeChannel(
                state.channel
            );

    } catch (_) {}

    state.channel =
        null;

}

const channelName =
    `room-${state.roomId}`;

log(
    "📡 Realtime:",
    channelName
);

state.channel =
    supabaseClient.channel(
        channelName
    );


state.channel.on(
    "broadcast",
    {
        event: "player"
    },
    ({ payload }) => {

        applyPlayerEvent(
            payload
        );

    }
);


state.channel.on(
    "broadcast",
    {
        event: "reaction"
    },
    ({ payload }) => {

        if (
            payload?.userId !==
            state.userId
        ) {

            showReaction(
                payload?.reaction
            );

        }

    }
);


state.channel.on(
    "postgres_changes",
    {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter:
            `room_id=eq.${state.roomId}`
    },
    payload => {

        appendMessage(
            payload.new
        );

    }
);


state.channel.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "room_members",
        filter:
            `room_id=eq.${state.roomId}`
    },
    () => {

        loadParticipants();

    }
);


state.channel.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "playlist_items",
        filter:
            `room_id=eq.${state.roomId}`
    },
    () => {

        loadPlaylist();

    }
);


await new Promise(
    resolve => {

        let finished =
            false;

        const finish =
            status => {

                if (finished) {
                    return;
                }

                finished = true;

                resolve(status);

            };

        state.channel.subscribe(
            status => {

                log(
                    "Realtime:",
                    status
                );

                if (
                    status ===
                    "SUBSCRIBED"
                ) {

                    setConnectionStatus(
                        "connected",
                        "Online"
                    );

                    finish(status);

                } else if (
                    status ===
                    "CHANNEL_ERROR"
                ) {

                    setConnectionStatus(
                        "error",
                        "Realtime indisponível"
                    );

                    finish(status);

                } else if (
                    status ===
                    "TIMED_OUT"
                ) {

                    setConnectionStatus(
                        "error",
                        "Conexão expirou"
                    );

                    finish(status);

                }

            }
        );

        setTimeout(
            () => {

                finish(
                    "TIMEOUT"
                );

            },
            10000
        );

    }
);
```

}

/* =========================================================
CHAT
========================================================= */

async function sendMessage(event) {

```
event?.preventDefault();

const message =
    chatInput?.value
        ?.trim() || "";

if (!message) {
    return;
}

if (
    !state.roomId ||
    !state.userId
) {

    showToast(
        "Você não está em uma sala."
    );

    return;

}

try {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("messages")
            .insert({

                room_id:
                    state.roomId,

                user_id:
                    state.userId,

                display_name:
                    state.userName,

                message:
                    message

            })
            .select("*")
            .single();

    if (error) {

        throw new Error(
            error.message
        );

    }

    /*
     * O próprio usuário pode não receber o evento
     * Realtime dependendo da configuração.
     * Por isso adicionamos localmente.
     */

    if (data) {

        appendMessage(
            data
        );

    }

    if (chatInput) {
        chatInput.value = "";
    }

} catch (error) {

    console.error(
        "❌ Chat:",
        error
    );

    showToast(
        "Não foi possível enviar a mensagem."
    );

}
```

}

/* =========================================================
MENSAGENS
========================================================= */

async function loadMessages() {

```
if (!state.roomId) {
    return;
}

const {
    data,
    error
} =
    await supabaseClient
        .from("messages")
        .select("*")
        .eq(
            "room_id",
            state.roomId
        )
        .order(
            "created_at",
            {
                ascending: true
            }
        )
        .limit(100);

if (error) {

    console.error(
        "❌ Mensagens:",
        error
    );

    return;

}

if (!chatMessages) {
    return;
}

chatMessages.innerHTML = "";

(data || []).forEach(
    message => {

        appendMessage(
            message,
            false
        );

    }
);

scrollChat();
```

}

function appendMessage(
message,
scroll = true
) {

```
if (
    !chatMessages ||
    !message
) {
    return;
}

const existing =
    chatMessages.querySelector(
        `[data-message-id="${message.id}"]`
    );

if (existing) {
    return;
}

const element =
    document.createElement(
        "div"
    );

element.className =
    "chat-message";

element.dataset.messageId =
    message.id;

element.innerHTML = `

    <strong>
        ${escapeHtml(
            message.display_name
        )}
    </strong>

    <span>
        ${escapeHtml(
            message.message
        )}
    </span>

`;

chatMessages.appendChild(
    element
);

if (scroll) {
    scrollChat();
}
```

}

function scrollChat() {

```
if (!chatMessages) {
    return;
}

chatMessages.scrollTop =
    chatMessages.scrollHeight;
```

}

/* =========================================================
REAÇÕES
========================================================= */

function sendReaction(reaction) {

```
if (
    !state.channel ||
    !reaction
) {
    return;
}

state.channel.send({

    type:
        "broadcast",

    event:
        "reaction",

    payload: {

        userId:
            state.userId,

        reaction:
            reaction

    }

});

showReaction(
    reaction
);
```

}

function showReaction(reaction) {

```
if (!reaction) {
    return;
}

const element =
    document.createElement(
        "div"
    );

element.className =
    "floating-reaction";

element.textContent =
    reaction;

document.body.appendChild(
    element
);

setTimeout(
    () => {

        element.remove();

    },
    2000
);
```

}

/* =========================================================
HEARTBEAT
========================================================= */

function startHeartbeat() {

```
stopHeartbeat();

updateHeartbeat();

state.heartbeat =
    setInterval(
        updateHeartbeat,
        30000
    );
```

}

async function updateHeartbeat() {

```
if (
    !state.roomId ||
    !state.userId
) {
    return;
}

const {
    error
} =
    await supabaseClient
        .from("room_members")
        .update({

            is_online:
                true,

            last_seen:
                new Date().toISOString()

        })
        .eq(
            "room_id",
            state.roomId
        )
        .eq(
            "user_id",
            state.userId
        );

if (error) {

    console.warn(
        "⚠️ Heartbeat:",
        error
    );

}
```

}

function stopHeartbeat() {

```
if (state.heartbeat) {

    clearInterval(
        state.heartbeat
    );

    state.heartbeat =
        null;

}
```

}

/* =========================================================
SAIR
========================================================= */

async function leaveRoom() {

```
try {

    if (
        state.roomId &&
        state.userId
    ) {

        await supabaseClient
            .from("room_members")
            .update({

                is_online:
                    false,

                last_seen:
                    new Date().toISOString()

            })
            .eq(
                "room_id",
                state.roomId
            )
            .eq(
                "user_id",
                state.userId
            );

    }

    stopHeartbeat();

    if (state.channel) {

        await supabaseClient
            .removeChannel(
                state.channel
            );

        state.channel =
            null;

    }

} catch (error) {

    console.warn(
        "Erro ao sair:",
        error
    );

}

state.room = null;
state.roomId = null;
state.isHost = false;

state.participants = [];
state.playlist = [];

state.currentVideoId = null;

if (videoPlayer) {

    videoPlayer.pause();

    videoPlayer.removeAttribute(
        "src"
    );

    videoPlayer.load();

}

showElement(
    homeScreen
);

hideElement(
    roomScreen
);

setConnectionStatus(
    "connected",
    "Online"
);

showToast(
    "Você saiu da sala."
);
```

}

/* =========================================================
COPIAR LINK
========================================================= */

async function copyRoomURL() {

```
if (!state.room?.code) {
    return;
}

const url =
    `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(
        state.room.code
    )}`;

try {

    await navigator.clipboard.writeText(
        url
    );

    showToast(
        "🔗 Link copiado!"
    );

} catch (error) {

    console.error(
        "❌ Copiar:",
        error
    );

    window.prompt(
        "Copie o link:",
        url
    );

}
```

}

/* =========================================================
ROOM PELA URL
========================================================= */

function checkRoomFromURL() {

```
refreshDOM();

const params =
    new URLSearchParams(
        window.location.search
    );

const code =
    params.get("room");

if (!code) {
    return;
}

const normalizedCode =
    code
        .trim()
        .toUpperCase();

if (roomCode) {

    roomCode.value =
        normalizedCode;

}

showElement(
    joinPanel
);

hideElement(
    createPanel
);

log(
    "🔗 Código pela URL:",
    normalizedCode
);
```

}

/* =========================================================
BEFORE UNLOAD
========================================================= */

window.addEventListener(
"beforeunload",
() => {

```
    if (
        state.roomId &&
        state.userId &&
        supabaseClient
    ) {

        supabaseClient
            .from("room_members")
            .update({

                is_online:
                    false,

                last_seen:
                    new Date().toISOString()

            })
            .eq(
                "room_id",
                state.roomId
            )
            .eq(
                "user_id",
                state.userId
            );

    }

}
```

);

/* =========================================================
DEBUG
========================================================= */

window.AlienWatchParty = {

```
state,

refreshDOM,

setupButtons,

createRoom,

joinRoom,

leaveRoom,

addVideo,

loadVideo,

sendMessage,

sendReaction,

loadRoomData,

subscribeRealtime
```

};

log(
"📡 script.js carregado."
);

