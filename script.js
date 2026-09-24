"use strict";

/* =========================================================
   ALIEN WATCH PARTY V2
   SUPABASE + GITHUB PAGES
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

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {

    try {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        console.log(
            "✅ Supabase inicializado."
        );

    } catch (error) {

        console.error(
            "❌ Erro Supabase:",
            error
        );

    }

} else {

    console.error(
        "❌ Biblioteca Supabase não encontrada."
    );

}


/* =========================================================
   ESTADO
========================================================= */

const state = {

    initialized: false,

    userId: null,

    userName: "",

    room: null,

    roomId: null,

    isHost: false,

    channel: null,

    heartbeat: null,

    participants: [],

    playlist: [],

    currentVideoId: null,

    currentVideoUrl: null,

    currentVideoTitle: "",

    playerType: null,

    ignorePlayerEvents: false,

    creatingRoom: false,

    joiningRoom: false,

    openingRoom: false

};


/* =========================================================
   DOM
========================================================= */

const $ = id =>
    document.getElementById(id);


/* =========================================================
   FUNÇÕES BÁSICAS
========================================================= */

function log(...args) {

    console.log(
        "[Alien Watch Party]",
        ...args
    );

}


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text ?? "");

    return div.innerHTML;
}


function show(element) {

    if (element) {
        element.classList.remove("hidden");
    }

}


function hide(element) {

    if (element) {
        element.classList.add("hidden");
    }

}


function setText(element, text) {

    if (element) {
        element.textContent =
            text ?? "";
    }

}


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    const element =
        $("toast");

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.classList.add("show");

    clearTimeout(
        toast.timer
    );

    toast.timer =
        setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   ERRO
========================================================= */

function errorMessage(element, message) {

    if (!element) {
        return;
    }

    element.textContent =
        message || "";

}


function clearError(element) {

    if (element) {
        element.textContent =
            "";
    }

}


/* =========================================================
   STATUS
========================================================= */

function connectionStatus(
    type,
    text
) {

    const dot =
        $("connectionDot");

    const label =
        $("connectionText");

    setText(
        label,
        text
    );

    if (!dot) {
        return;
    }

    dot.classList.remove(
        "connected",
        "connecting",
        "error"
    );

    if (
        type === "connected" ||
        type === "connecting" ||
        type === "error"
    ) {

        dot.classList.add(
            type
        );

    }

}


/* =========================================================
   STATUS DA APLICAÇÃO
========================================================= */

function appStatus(message) {

    setText(
        $("appStatus"),
        message
    );

}


/* =========================================================
   MOSTRAR HOME
========================================================= */

function showHome() {

    show(
        $("homeScreen")
    );

    hide(
        $("roomScreen")
    );

}


/* =========================================================
   MOSTRAR MODAL CRIAR
========================================================= */

function openCreatePanel() {

    show(
        $("createPanel")
    );

    hide(
        $("joinPanel")
    );

    clearError(
        $("createError")
    );

    setTimeout(
        () => {

            $("createName")?.focus();

        },
        50
    );

}


/* =========================================================
   MOSTRAR MODAL ENTRAR
========================================================= */

function openJoinPanel() {

    show(
        $("joinPanel")
    );

    hide(
        $("createPanel")
    );

    clearError(
        $("joinError")
    );

    setTimeout(
        () => {

            $("joinName")?.focus();

        },
        50
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init,
    {
        once: true
    }
);


async function init() {

    if (state.initialized) {
        return;
    }

    state.initialized =
        true;

    log(
        "🚀 Inicializando aplicação..."
    );

    connectionStatus(
        "connecting",
        "Conectando..."
    );

    setupEvents();

    if (!supabaseClient) {

        connectionStatus(
            "error",
            "Supabase indisponível"
        );

        appStatus(
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
                "Sessão:",
                error
            );

        }

        if (
            data?.session?.user?.id
        ) {

            state.userId =
                data.session.user.id;

            log(
                "👤 Sessão existente:",
                state.userId
            );

        }

        connectionStatus(
            "connected",
            "Online"
        );

        appStatus(
            "🟢 Sistema pronto."
        );

        checkRoomURL();

        log(
            "✅ Aplicação pronta."
        );

    } catch (error) {

        console.error(
            error
        );

        connectionStatus(
            "error",
            "Erro"
        );

        appStatus(
            "❌ Erro ao inicializar."
        );

    }

}


/* =========================================================
   EVENTOS
========================================================= */

function setupEvents() {

    /* Criar */

    $("showCreateRoom")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openCreatePanel();

            }
        );


    /* Entrar */

    $("showJoinRoom")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openJoinPanel();

            }
        );


    /* Criar sala */

    $("createRoomBtn")
        ?.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                await createRoom();

            }
        );


    /* Entrar */

    $("joinRoomBtn")
        ?.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                await joinRoom();

            }
        );


    /* Fechar */

    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        const id =
                            button.dataset.close;

                        hide(
                            $(id)
                        );

                    }
                );

            }
        );


    /* Enter criar */

    $("createName")
        ?.addEventListener(
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


    $("roomName")
        ?.addEventListener(
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


    /* Enter entrar */

    $("joinName")
        ?.addEventListener(
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


    $("roomCode")
        ?.addEventListener(
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


    /* Sair */

    $("leaveRoomBtn")
        ?.addEventListener(
            "click",
            leaveRoom
        );


    /* Copiar */

    $("copyRoomLink")
        ?.addEventListener(
            "click",
            copyRoomURL
        );


    /* Adicionar vídeo */

    $("showAddVideo")
        ?.addEventListener(
            "click",
            () => {

                show(
                    $("videoModal")
                );

                $("videoTitle")?.focus();

            }
        );


    $("addVideoBtn")
        ?.addEventListener(
            "click",
            addVideo
        );


    /* Chat */

    $("chatForm")
        ?.addEventListener(
            "submit",
            sendMessage
        );


    /* Reações */

    document
        .querySelectorAll(
            "[data-reaction]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        sendReaction(
                            button.dataset.reaction
                        );

                    }
                );

            }
        );


    /* Player */

    $("playBtn")
        ?.addEventListener(
            "click",
            () => {

                playCurrentVideo(
                    true
                );

            }
        );


    $("pauseBtn")
        ?.addEventListener(
            "click",
            () => {

                pauseCurrentVideo(
                    true
                );

            }
        );


    $("syncBtn")
        ?.addEventListener(
            "click",
            () => {

                syncCurrentVideo();

            }
        );


    /* Vídeo HTML */

    $("videoPlayer")
        ?.addEventListener(
            "play",
            () => {

                if (
                    !state.ignorePlayerEvents &&
                    state.playerType === "video"
                ) {

                    broadcastPlayer(
                        "play",
                        getCurrentTime()
                    );

                }

            }
        );


    $("videoPlayer")
        ?.addEventListener(
            "pause",
            () => {

                if (
                    !state.ignorePlayerEvents &&
                    state.playerType === "video"
                ) {

                    broadcastPlayer(
                        "pause",
                        getCurrentTime()
                    );

                }

            }
        );


    $("videoPlayer")
        ?.addEventListener(
            "seeked",
            () => {

                if (
                    !state.ignorePlayerEvents &&
                    state.playerType === "video"
                ) {

                    broadcastPlayer(
                        "seek",
                        getCurrentTime()
                    );

                }

            }
        );


    log(
        "✅ Eventos configurados."
    );

}


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

async function ensureUser() {

    if (!supabaseClient) {

        throw new Error(
            "Supabase não está disponível."
        );

    }


    if (state.userId) {
        return state.userId;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        throw new Error(
            error.message
        );

    }


    if (
        data?.session?.user?.id
    ) {

        state.userId =
            data.session.user.id;

        return state.userId;

    }


    log(
        "🔐 Criando usuário anônimo..."
    );


    const result =
        await supabaseClient
            .auth
            .signInAnonymously();


    if (result.error) {

        const message =
            result.error.message ||
            "";

        console.error(
            "❌ Anonymous:",
            result.error
        );

        if (
            message
                .toLowerCase()
                .includes("anonymous")
        ) {

            throw new Error(
                "O login anônimo está desativado no Supabase. Ative Authentication → Providers → Anonymous Sign-Ins."
            );

        }

        throw new Error(
            message
        );

    }


    if (
        !result.data?.user?.id
    ) {

        throw new Error(
            "Supabase não retornou um usuário."
        );

    }


    state.userId =
        result.data.user.id;


    log(
        "✅ Usuário autenticado:",
        state.userId
    );


    return state.userId;

}


/* =========================================================
   CÓDIGO DA SALA
========================================================= */

function generateRoomCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        code +=
            characters[
                Math.floor(
                    Math.random() *
                    characters.length
                )
            ];

    }

    return code;

}


/* =========================================================
   CRIAR SALA
========================================================= */

async function createRoom() {

    if (state.creatingRoom) {
        return;
    }

    const name =
        $("createName")
            ?.value
            .trim() || "";

    const roomName =
        $("roomName")
            ?.value
            .trim() || "";

    const isPrivate =
        $("roomPrivate")
            ?.checked || false;

    clearError(
        $("createError")
    );


    if (!name) {

        errorMessage(
            $("createError"),
            "Digite seu nome."
        );

        $("createName")?.focus();

        return;
    }


    if (!roomName) {

        errorMessage(
            $("createError"),
            "Digite o nome da sala."
        );

        $("roomName")?.focus();

        return;
    }


    state.creatingRoom =
        true;


    const button =
        $("createRoomBtn");


    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "⏳ Criando sala...";

        }


        connectionStatus(
            "connecting",
            "Autenticando..."
        );


        /* 1. LOGIN */

        await ensureUser();


        /* 2. GERAR SALA */

        connectionStatus(
            "connecting",
            "Criando sala..."
        );


        let room =
            null;

        let lastError =
            null;


        for (
            let attempt = 0;
            attempt < 5;
            attempt++
        ) {

            const code =
                generateRoomCode();


            const result =
                await supabaseClient
                    .from("rooms")
                    .insert({

                        name:
                            roomName,

                        code:
                            code,

                        owner_id:
                            state.userId,

                        is_private:
                            isPrivate,

                        is_active:
                            true

                    })
                    .select()
                    .single();


            if (!result.error) {

                room =
                    result.data;

                break;

            }


            lastError =
                result.error;


            console.error(
                "❌ INSERT rooms:",
                result.error
            );


            /* código duplicado */

            if (
                result.error.code ===
                "23505"
            ) {

                continue;

            }


            break;

        }


        if (!room) {

            throw convertSupabaseError(
                lastError
            );

        }


        log(
            "🏠 Sala criada:",
            room
        );


        /* 3. ESTADO */

        state.userName =
            name;

        state.room =
            room;

        state.roomId =
            room.id;

        state.isHost =
            true;


        /* 4. ADICIONAR DONO */

        connectionStatus(
            "connecting",
            "Entrando na sala..."
        );


        await addMember();


        /* 5. ABRIR */

        await openRoom();


        hide(
            $("createPanel")
        );


        connectionStatus(
            "connected",
            "Online"
        );


        appStatus(
            "🟢 Sala criada."
        );


        toast(
            `🎉 Sala ${room.code} criada!`
        );


    } catch (error) {

        console.error(
            "❌ ERRO AO CRIAR SALA:",
            error
        );


        errorMessage(
            $("createError"),
            error.message ||
            "Não foi possível criar a sala."
        );


        connectionStatus(
            "error",
            "Erro"
        );

    } finally {

        state.creatingRoom =
            false;


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "🚀 Criar sala";

        }

    }

}


/* =========================================================
   CONVERTER ERROS SUPABASE
========================================================= */

function convertSupabaseError(error) {

    if (!error) {

        return new Error(
            "Erro desconhecido ao criar a sala."
        );

    }


    console.error(
        "Supabase error:",
        error
    );


    if (
        error.code === "42501"
    ) {

        return new Error(
            "Permissão negada pelo RLS. Execute o SQL atualizado do projeto."
        );

    }


    if (
        error.code === "23505"
    ) {

        return new Error(
            "Código da sala duplicado. Tente novamente."
        );

    }


    if (
        error.code === "42P01"
    ) {

        return new Error(
            "A tabela rooms não existe no Supabase."
        );

    }


    return new Error(
        error.message ||
        "Erro no Supabase."
    );

}


/* =========================================================
   ENTRAR
========================================================= */

async function joinRoom() {

    if (state.joiningRoom) {
        return;
    }


    const name =
        $("joinName")
            ?.value
            .trim() || "";


    const code =
        $("roomCode")
            ?.value
            .trim()
            .toUpperCase() || "";


    clearError(
        $("joinError")
    );


    if (!name) {

        errorMessage(
            $("joinError"),
            "Digite seu nome."
        );

        return;
    }


    if (
        !/^[A-Z0-9]{6}$/.test(code)
    ) {

        errorMessage(
            $("joinError"),
            "O código deve possuir 6 caracteres."
        );

        return;
    }


    state.joiningRoom =
        true;


    const button =
        $("joinRoomBtn");


    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "⏳ Entrando...";

        }


        connectionStatus(
            "connecting",
            "Autenticando..."
        );


        await ensureUser();


        connectionStatus(
            "connecting",
            "Procurando sala..."
        );


        const result =
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


        if (result.error) {

            throw new Error(
                result.error.message
            );

        }


        if (!result.data) {

            throw new Error(
                "Sala não encontrada."
            );

        }


        state.userName =
            name;

        state.room =
            result.data;

        state.roomId =
            result.data.id;

        state.isHost =
            result.data.owner_id ===
            state.userId;


        await addMember();

        await openRoom();


        hide(
            $("joinPanel")
        );


        connectionStatus(
            "connected",
            "Online"
        );


        toast(
            "🎬 Você entrou na sala!"
        );


    } catch (error) {

        console.error(
            "❌ ENTRAR:",
            error
        );


        errorMessage(
            $("joinError"),
            error.message ||
            "Não foi possível entrar."
        );


        connectionStatus(
            "error",
            "Erro"
        );

    } finally {

        state.joiningRoom =
            false;


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "🔗 Entrar";

        }

    }

}


/* =========================================================
   MEMBRO
========================================================= */

async function addMember() {

    if (
        !state.roomId ||
        !state.userId
    ) {

        throw new Error(
            "Usuário ou sala inválidos."
        );

    }


    const result =
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

            );


    if (result.error) {

        throw new Error(
            "Não foi possível adicionar o participante: " +
            result.error.message
        );

    }

}


/* =========================================================
   ABRIR SALA
========================================================= */

async function openRoom() {

    if (state.openingRoom) {
        return;
    }

    state.openingRoom =
        true;


    try {

        hide(
            $("homeScreen")
        );

        show(
            $("roomScreen")
        );


        setText(
            $("roomTitle"),
            state.room.name
        );


        setText(
            $("roomCodeDisplay"),
            state.room.code
        );


        setText(
            $("hostStatus"),
            state.isHost
                ? "👑 Você é o anfitrião"
                : "👤 Participante"
        );


        await loadParticipants();

        await loadPlaylist();

        await loadMessages();

        await subscribeRealtime();

        startHeartbeat();


        connectionStatus(
            "connected",
            "Online"
        );


        log(
            "🏠 Sala aberta."
        );


    } catch (error) {

        console.error(
            "❌ Abrir sala:",
            error
        );

        toast(
            "Erro ao carregar dados da sala."
        );

    } finally {

        state.openingRoom =
            false;

    }

}


/* =========================================================
   PARTICIPANTES
========================================================= */

async function loadParticipants() {

    if (!state.roomId) {
        return;
    }


    const result =
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


    if (result.error) {

        console.error(
            "Participantes:",
            result.error
        );

        return;

    }


    state.participants =
        result.data || [];


    renderParticipants();

}


function renderParticipants() {

    const container =
        $("participants");


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    state.participants
        .forEach(
            member => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "participant-item";


                element.innerHTML = `

                    <span
                        class="participant-status ${
                            member.is_online
                                ? "online"
                                : ""
                        }"
                    ></span>

                    <span class="participant-name">
                        ${escapeHtml(
                            member.display_name
                        )}
                    </span>

                `;


                container.appendChild(
                    element
                );

            }
        );


    setText(
        $("participantCount"),
        state.participants.length
    );

}


/* =========================================================
   PLAYLIST
========================================================= */

async function loadPlaylist() {

    if (!state.roomId) {
        return;
    }


    const result =
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


    if (result.error) {

        console.error(
            "Playlist:",
            result.error
        );

        return;

    }


    state.playlist =
        result.data || [];


    renderPlaylist();


    if (
        state.playlist.length > 0 &&
        !state.currentVideoId
    ) {

        loadVideo(
            state.playlist[0],
            false
        );

    }

}


function renderPlaylist() {

    const container =
        $("playlist");


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (
        state.playlist.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-playlist">
                Nenhum vídeo adicionado.
            </div>

        `;

        return;

    }


    state.playlist
        .forEach(
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
                        title="Excluir"
                    >
                        ×
                    </button>

                `;


                element
                    .querySelector(
                        ".playlist-play"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            loadVideo(
                                item,
                                true
                            );

                        }
                    );


                element
                    .querySelector(
                        ".playlist-delete"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            removePlaylistItem(
                                item
                            );

                        }
                    );


                container.appendChild(
                    element
                );

            }
        );

}


/* =========================================================
   ADICIONAR VÍDEO
========================================================= */

async function addVideo() {

    clearError(
        $("videoError")
    );


    const title =
        $("videoTitle")
            ?.value
            .trim() || "";


    const url =
        $("videoUrl")
            ?.value
            .trim() || "";


    if (!title) {

        errorMessage(
            $("videoError"),
            "Digite o nome do vídeo."
        );

        return;

    }


    if (!url) {

        errorMessage(
            $("videoError"),
            "Digite a URL."
        );

        return;

    }


    if (
        !/^https?:\/\//i.test(url)
    ) {

        errorMessage(
            $("videoError"),
            "A URL precisa começar com http:// ou https://."
        );

        return;

    }


    try {

        const result =
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
                        state.playlist.length,

                    added_by:
                        state.userId

                })
                .select()
                .single();


        if (result.error) {

            throw new Error(
                result.error.message
            );

        }


        state.playlist.push(
            result.data
        );


        renderPlaylist();


        if (
            !state.currentVideoId
        ) {

            loadVideo(
                result.data,
                false
            );

        }


        $("videoTitle").value =
            "";

        $("videoUrl").value =
            "";


        hide(
            $("videoModal")
        );


        toast(
            "🎬 Vídeo adicionado!"
        );


    } catch (error) {

        console.error(
            "Adicionar vídeo:",
            error
        );

        errorMessage(
            $("videoError"),
            error.message
        );

    }

}


/* =========================================================
   REMOVER VÍDEO
========================================================= */

async function removePlaylistItem(
    item
) {

    if (!item?.id) {
        return;
    }


    const result =
        await supabaseClient
            .from("playlist_items")
            .delete()
            .eq(
                "id",
                item.id
            );


    if (result.error) {

        toast(
            "❌ Não foi possível excluir."
        );

        console.error(
            result.error
        );

        return;

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

        state.currentVideoUrl =
            null;


        stopCurrentVideo();


        if (
            state.playlist.length
        ) {

            loadVideo(
                state.playlist[0],
                false
            );

        }

    }


    renderPlaylist();


    toast(
        "Vídeo removido."
    );

}


/* =========================================================
   YOUTUBE ID
========================================================= */

function getYouTubeId(url) {

    try {

        const parsed =
            new URL(url);


        if (
            parsed.hostname.includes(
                "youtu.be"
            )
        ) {

            return parsed.pathname
                .replace(
                    "/",
                    ""
                );

        }


        if (
            parsed.hostname.includes(
                "youtube.com"
            )
        ) {

            if (
                parsed.pathname ===
                "/watch"
            ) {

                return parsed.searchParams.get(
                    "v"
                );

            }


            if (
                parsed.pathname.startsWith(
                    "/shorts/"
                )
            ) {

                return parsed.pathname
                    .split("/")
                    [2];

            }


            if (
                parsed.pathname.startsWith(
                    "/embed/"
                )
            ) {

                return parsed.pathname
                    .split("/")
                    [2];

            }

        }

    } catch (_) {

        return null;

    }


    return null;

}


/* =========================================================
   CARREGAR VÍDEO
========================================================= */

function loadVideo(
    item,
    broadcast = false
) {

    if (!item) {
        return;
    }


    state.currentVideoId =
        item.id;

    state.currentVideoUrl =
        item.video_url;

    state.currentVideoTitle =
        item.title;


    setText(
        $("currentVideoTitle"),
        item.title
    );


    renderPlaylist();


    const youtubeId =
        getYouTubeId(
            item.video_url
        );


    if (youtubeId) {

        loadYouTube(
            youtubeId,
            broadcast
        );

    } else {

        loadDirectVideo(
            item.video_url,
            broadcast
        );

    }

}


/* =========================================================
   PLAYER DIRETO
========================================================= */

function loadDirectVideo(
    url,
    broadcast
) {

    const video =
        $("videoPlayer");

    const youtube =
        $("youtubePlayer");

    const placeholder =
        $("videoPlaceholder");


    if (!video) {
        return;
    }


    state.playerType =
        "video";


    hide(
        youtube
    );


    hide(
        placeholder
    );


    show(
        video
    );


    state.ignorePlayerEvents =
        true;


    video.src =
        url;


    video.load();


    setTimeout(
        () => {

            state.ignorePlayerEvents =
                false;

        },
        500
    );


    if (broadcast) {

        broadcastPlayer(
            "load",
            0,
            state.currentVideoId,
            url
        );

    }

}


/* =========================================================
   YOUTUBE
========================================================= */

function loadYouTube(
    youtubeId,
    broadcast
) {

    const video =
        $("videoPlayer");

    const iframe =
        $("youtubePlayer");

    const placeholder =
        $("videoPlaceholder");


    if (!iframe) {
        return;
    }


    state.playerType =
        "youtube";


    hide(
        video
    );


    hide(
        placeholder
    );


    iframe.classList.remove(
        "hidden-player"
    );


    iframe.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(youtubeId) +
        "?enablejsapi=1&autoplay=0&controls=1&rel=0";


    if (broadcast) {

        broadcastPlayer(
            "load",
            0,
            state.currentVideoId,
            state.currentVideoUrl
        );

    }

}


/* =========================================================
   PARAR PLAYER
========================================================= */

function stopCurrentVideo() {

    const video =
        $("videoPlayer");

    const iframe =
        $("youtubePlayer");


    state.ignorePlayerEvents =
        true;


    if (video) {

        try {
            video.pause();
        } catch (_) {}

        video.removeAttribute(
            "src"
        );

        video.load();

    }


    if (iframe) {

        iframe.src =
            "about:blank";

        iframe.classList.add(
            "hidden-player"
        );

    }


    state.playerType =
        null;


    setTimeout(
        () => {

            state.ignorePlayerEvents =
                false;

        },
        300
    );

}


/* =========================================================
   TEMPO ATUAL
========================================================= */

function getCurrentTime() {

    if (
        state.playerType ===
        "video"
    ) {

        return (
            $("videoPlayer")
                ?.currentTime || 0
        );

    }


    return 0;

}


/* =========================================================
   PLAY
========================================================= */

async function playCurrentVideo(
    broadcast = false
) {

    if (
        state.playerType ===
        "video"
    ) {

        const video =
            $("videoPlayer");


        if (!video) {
            return;
        }


        try {

            await video.play();

            if (broadcast) {

                broadcastPlayer(
                    "play",
                    video.currentTime
                );

            }

        } catch (error) {

            console.warn(
                "Play bloqueado:",
                error
            );

            toast(
                "Clique no player para permitir a reprodução."
            );

        }

        return;
    }


    if (
        state.playerType ===
        "youtube"
    ) {

        sendYouTubeCommand(
            "playVideo"
        );


        if (broadcast) {

            broadcastPlayer(
                "play",
                0
            );

        }

    }

}


/* =========================================================
   PAUSE
========================================================= */

function pauseCurrentVideo(
    broadcast = false
) {

    if (
        state.playerType ===
        "video"
    ) {

        const video =
            $("videoPlayer");


        if (!video) {
            return;
        }


        video.pause();


        if (broadcast) {

            broadcastPlayer(
                "pause",
                video.currentTime
            );

        }


        return;

    }


    if (
        state.playerType ===
        "youtube"
    ) {

        sendYouTubeCommand(
            "pauseVideo"
        );


        if (broadcast) {

            broadcastPlayer(
                "pause",
                0
            );

        }

    }

}


/* =========================================================
   YOUTUBE COMMAND
========================================================= */

function sendYouTubeCommand(
    command
) {

    const iframe =
        $("youtubePlayer");


    if (
        !iframe ||
        !iframe.contentWindow
    ) {

        return;

    }


    iframe.contentWindow.postMessage(
        JSON.stringify({

            event:
                "command",

            func:
                command,

            args:
                []

        }),
        "*"
    );

}


/* =========================================================
   SINCRONIZAR
========================================================= */

function syncCurrentVideo() {

    if (
        !state.channel
    ) {

        toast(
            "Realtime ainda não está conectado."
        );

        return;

    }


    broadcastPlayer(
        "sync",
        getCurrentTime()
    );


    toast(
        "🔄 Sincronização enviada."
    );

}


/* =========================================================
   BROADCAST PLAYER
========================================================= */

async function broadcastPlayer(
    action,
    time = 0,
    videoId = state.currentVideoId,
    videoUrl = state.currentVideoUrl
) {

    if (!state.channel) {
        return;
    }


    await state.channel.send({

        type:
            "broadcast",

        event:
            "player",

        payload: {

            userId:
                state.userId,

            action:
                action,

            time:
                Number(time) || 0,

            videoId:
                videoId,

            videoUrl:
                videoUrl

        }

    });

}


/* =========================================================
   RECEBER PLAYER
========================================================= */

async function applyRemotePlayer(
    payload
) {

    if (!payload) {
        return;
    }


    if (
        payload.userId ===
        state.userId
    ) {

        return;

    }


    /* Outro vídeo */

    if (
        payload.videoId &&
        payload.videoId !==
        state.currentVideoId
    ) {

        const item =
            state.playlist.find(
                video =>
                    video.id ===
                    payload.videoId
            );


        if (item) {

            loadVideo(
                item,
                false
            );

        } else if (
            payload.videoUrl
        ) {

            state.currentVideoId =
                payload.videoId;

            state.currentVideoUrl =
                payload.videoUrl;

            const youtubeId =
                getYouTubeId(
                    payload.videoUrl
                );


            if (youtubeId) {

                loadYouTube(
                    youtubeId,
                    false
                );

            } else {

                loadDirectVideo(
                    payload.videoUrl,
                    false
                );

            }

        }

    }


    state.ignorePlayerEvents =
        true;


    try {

        if (
            state.playerType ===
            "video"
        ) {

            const video =
                $("videoPlayer");


            if (
                typeof payload.time ===
                "number"
            ) {

                try {

                    video.currentTime =
                        payload.time;

                } catch (_) {}

            }


            if (
                payload.action ===
                    "play" ||
                payload.action ===
                    "sync"
            ) {

                if (
                    payload.action ===
                    "play"
                ) {

                    await video.play()
                        .catch(
                            () => {}
                        );

                }

            }


            if (
                payload.action ===
                "pause"
            ) {

                video.pause();

            }

        }


        if (
            state.playerType ===
            "youtube"
        ) {

            const iframe =
                $("youtubePlayer");


            if (
                payload.action ===
                "play"
            ) {

                postYouTubeCommand(
                    iframe,
                    "playVideo"
                );

            }


            if (
                payload.action ===
                "pause"
            ) {

                postYouTubeCommand(
                    iframe,
                    "pauseVideo"
                );

            }

        }

    } finally {

        setTimeout(
            () => {

                state.ignorePlayerEvents =
                    false;

            },
            500
        );

    }

}


/* =========================================================
   YOUTUBE POST MESSAGE
========================================================= */

function postYouTubeCommand(
    iframe,
    command
) {

    if (
        !iframe?.contentWindow
    ) {

        return;

    }


    iframe.contentWindow.postMessage(
        JSON.stringify({

            event:
                "command",

            func:
                command,

            args:
                []

        }),
        "*"
    );

}


/* =========================================================
   REALTIME
========================================================= */

async function subscribeRealtime() {

    if (
        !state.roomId ||
        !supabaseClient
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

    }


    const channelName =
        "watch-party-" +
        state.roomId;


    state.channel =
        supabaseClient.channel(
            channelName,
            {

                config: {

                    broadcast: {
                        self: false
                    },

                    presence: {
                        key:
                            state.userId
                    }

                }

            }
        );


    /* PLAYER */

    state.channel.on(
        "broadcast",
        {
            event:
                "player"
        },
        ({ payload }) => {

            applyRemotePlayer(
                payload
            );

        }
    );


    /* REAÇÃO */

    state.channel.on(
        "broadcast",
        {
            event:
                "reaction"
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


    /* CHAT */

    state.channel.on(
        "postgres_changes",
        {

            event:
                "INSERT",

            schema:
                "public",

            table:
                "messages",

            filter:
                `room_id=eq.${state.roomId}`

        },
        payload => {

            appendMessage(
                payload.new
            );

        }
    );


    /* PARTICIPANTES */

    state.channel.on(
        "postgres_changes",
        {

            event:
                "*",

            schema:
                "public",

            table:
                "room_members",

            filter:
                `room_id=eq.${state.roomId}`

        },
        () => {

            loadParticipants();

        }
    );


    /* PLAYLIST */

    state.channel.on(
        "postgres_changes",
        {

            event:
                "*",

            schema:
                "public",

            table:
                "playlist_items",

            filter:
                `room_id=eq.${state.roomId}`

        },
        () => {

            loadPlaylist();

        }
    );


    return new Promise(
        resolve => {

            let done =
                false;


            const finish =
                status => {

                    if (done) {
                        return;
                    }

                    done =
                        true;

                    resolve(
                        status
                    );

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

                        connectionStatus(
                            "connected",
                            "Online"
                        );

                        finish(
                            status
                        );

                    }


                    if (
                        status ===
                        "CHANNEL_ERROR"
                    ) {

                        connectionStatus(
                            "error",
                            "Realtime erro"
                        );

                        finish(
                            status
                        );

                    }


                    if (
                        status ===
                        "TIMED_OUT"
                    ) {

                        connectionStatus(
                            "error",
                            "Realtime expirou"
                        );

                        finish(
                            status
                        );

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

}


/* =========================================================
   CHAT
========================================================= */

async function sendMessage(
    event
) {

    event.preventDefault();


    const input =
        $("chatInput");


    const message =
        input?.value
            .trim() || "";


    if (!message) {
        return;
    }


    if (
        !state.roomId ||
        !state.userId
    ) {

        return;

    }


    const result =
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
            .select()
            .single();


    if (result.error) {

        console.error(
            "Chat:",
            result.error
        );

        toast(
            "❌ Não foi possível enviar."
        );

        return;

    }


    if (input) {
        input.value =
            "";
    }


    appendMessage(
        result.data
    );

}


async function loadMessages() {

    if (!state.roomId) {
        return;
    }


    const result =
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


    if (result.error) {

        console.error(
            "Mensagens:",
            result.error
        );

        return;

    }


    const container =
        $("chatMessages");


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    (
        result.data || []
    ).forEach(
        message => {

            appendMessage(
                message,
                false
            );

        }
    );


    scrollChat();

}


function appendMessage(
    message,
    scroll = true
) {

    const container =
        $("chatMessages");


    if (
        !container ||
        !message
    ) {

        return;

    }


    if (
        container.querySelector(
            `[data-message-id="${message.id}"]`
        )
    ) {

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


    container.appendChild(
        element
    );


    if (scroll) {
        scrollChat();
    }

}


function scrollChat() {

    const container =
        $("chatMessages");


    if (container) {

        container.scrollTop =
            container.scrollHeight;

    }

}


/* =========================================================
   REAÇÕES
========================================================= */

async function sendReaction(
    reaction
) {

    if (
        !state.channel ||
        !reaction
    ) {

        return;

    }


    await state.channel.send({

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

}


function showReaction(
    reaction
) {

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

}


/* =========================================================
   HEARTBEAT
========================================================= */

function startHeartbeat() {

    stopHeartbeat();

    updateHeartbeat();


    state.heartbeat =
        setInterval(
            updateHeartbeat,
            30000
        );

}


function stopHeartbeat() {

    if (
        state.heartbeat
    ) {

        clearInterval(
            state.heartbeat
        );

        state.heartbeat =
            null;

    }

}


async function updateHeartbeat() {

    if (
        !state.roomId ||
        !state.userId
    ) {

        return;

    }


    const result =
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


    if (result.error) {

        console.warn(
            "Heartbeat:",
            result.error
        );

    }

}


/* =========================================================
   SAIR
========================================================= */

async function leaveRoom() {

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
            "Sair:",
            error
        );

    }


    state.room =
        null;

    state.roomId =
        null;

    state.isHost =
        false;

    state.participants =
        [];

    state.playlist =
        [];

    state.currentVideoId =
        null;

    state.currentVideoUrl =
        null;

    stopCurrentVideo();

    showHome();

    connectionStatus(
        "connected",
        "Online"
    );

    toast(
        "Você saiu da sala."
    );

}


/* =========================================================
   COPIAR LINK
========================================================= */

async function copyRoomURL() {

    if (
        !state.room?.code
    ) {

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


        toast(
            "🔗 Link copiado!"
        );

    } catch (_) {

        window.prompt(
            "Copie o link:",
            url
        );

    }

}


/* =========================================================
   URL DA SALA
========================================================= */

function checkRoomURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const code =
        params
            .get("room")
            ?.trim()
            .toUpperCase();


    if (!code) {
        return;
    }


    const input =
        $("roomCode");


    if (input) {

        input.value =
            code;

    }


    openJoinPanel();

}


/* =========================================================
   ANTES DE FECHAR
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

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
);


/* =========================================================
   DEBUG
========================================================= */

window.AlienWatchParty = {

    state,

    createRoom,

    joinRoom,

    leaveRoom,

    addVideo,

    loadVideo,

    sendMessage,

    sendReaction,

    syncCurrentVideo,

    subscribeRealtime

};


console.log(
    "📡 Alien Watch Party script.js carregado."
);
