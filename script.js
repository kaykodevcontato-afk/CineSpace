/* =========================================================
   ALIEN WATCH PARTY V2
   Watch2Gether-like
   Supabase + GitHub Pages
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO SUPABASE
   ========================================================= */

const SUPABASE_URL = "https://ilenxaiiigqjmuannbdz.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI6ImxZW5jYWlpaWdxam11YW5uYmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMTgxNDQsImV4cCI6MjEwNTc5NDE0NH0.EGTWxgdSEFCY_tUpdG6Q9Jdnv_mTJbD784CgUmCSMtw";


/* =========================================================
   CLIENTE SUPABASE
   ========================================================= */

let supabaseClient = null;

try {
    if (
        SUPABASE_URL &&
        SUPABASE_ANON_KEY &&
        window.supabase
    ) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

        console.log("✅ Supabase inicializado.");
    } else {
        console.error("❌ Supabase não foi encontrado.");
    }
} catch (error) {
    console.error(
        "❌ Erro ao inicializar Supabase:",
        error
    );
}


/* =========================================================
   ESTADO GLOBAL
   ========================================================= */

const state = {
    userId: null,
    userName: "",

    room: null,
    roomId: null,
    isHost: false,

    participants: [],
    playlist: [],

    currentVideoId: null,

    channel: null,

    lastSync: 0,

    heartbeat: null,

    initialized: false
};


/* =========================================================
   FUNÇÕES AUXILIARES
   ========================================================= */

const $ = (id) => document.getElementById(id);


function log(...args) {
    console.log("[Alien Watch Party]", ...args);
}


function showElement(element) {
    if (element) {
        element.style.display = "";
    }
}


function hideElement(element) {
    if (element) {
        element.style.display = "none";
    }
}


function setText(element, text) {
    if (element) {
        element.textContent = text ?? "";
    }
}


function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
}


/* =========================================================
   DOM
   ========================================================= */

const homeScreen = $("homeScreen");
const roomScreen = $("roomScreen");

const videoPlayer = $("videoPlayer");
const videoPlaceholder = $("videoPlaceholder");

const playlist = $("playlist");
const participants = $("participants");
const chatMessages = $("chatMessages");

const showCreateRoom = $("showCreateRoom");
const showJoinRoom = $("showJoinRoom");

const createPanel = $("createPanel");
const joinPanel = $("joinPanel");

const createName = $("createName");
const roomName = $("roomName");
const roomPrivate = $("roomPrivate");

const createRoomBtn = $("createRoomBtn");
const createError = $("createError");

const joinName = $("joinName");
const roomCode = $("roomCode");
const joinRoomBtn = $("joinRoomBtn");
const joinError = $("joinError");

const leaveRoomBtn = $("leaveRoomBtn");
const copyRoomLink = $("copyRoomLink");

const showAddVideo = $("showAddVideo");
const videoModal = $("videoModal");
const addVideoBtn = $("addVideoBtn");

const videoTitle = $("videoTitle");
const videoUrl = $("videoUrl");
const videoError = $("videoError");

const chatForm = $("chatForm");
const chatInput = $("chatInput");

const connectionDot = $("connectionDot");
const connectionText = $("connectionText");

const roomTitle = $("roomTitle");
const roomCodeDisplay = $("roomCodeDisplay");

const participantCount = $("participantCount");
const hostStatus = $("hostStatus");

const toastElement = $("toast");


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", init);


async function init() {

    if (state.initialized) {
        return;
    }

    state.initialized = true;

    log("🚀 Inicializando aplicação...");

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
            "Erro ao inicializar o Supabase."
        );

        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error) {
            console.warn(
                "⚠️ Não foi possível recuperar usuário:",
                error
            );
        }

        if (data?.user) {

            state.userId = data.user.id;

            log(
                "👤 Usuário encontrado:",
                state.userId
            );
        }

    } catch (error) {

        console.warn(
            "⚠️ Erro ao verificar autenticação:",
            error
        );
    }

    checkRoomFromURL();

    setConnectionStatus(
        "connected",
        "Online"
    );

    log("✅ Aplicação pronta.");
}


/* =========================================================
   BOTÕES
   ========================================================= */

function setupButtons() {

    showCreateRoom?.addEventListener(
        "click",
        () => {

            showElement(createPanel);
            hideElement(joinPanel);

            createError.textContent = "";
        }
    );


    showJoinRoom?.addEventListener(
        "click",
        () => {

            showElement(joinPanel);
            hideElement(createPanel);

            joinError.textContent = "";
        }
    );


    createRoomBtn?.addEventListener(
        "click",
        createRoom
    );


    joinRoomBtn?.addEventListener(
        "click",
        joinRoom
    );


    leaveRoomBtn?.addEventListener(
        "click",
        leaveRoom
    );


    copyRoomLink?.addEventListener(
        "click",
        copyRoomURL
    );


    showAddVideo?.addEventListener(
        "click",
        () => {

            showElement(videoModal);

            if (videoTitle) {
                videoTitle.focus();
            }
        }
    );


    addVideoBtn?.addEventListener(
        "click",
        addVideo
    );


    chatForm?.addEventListener(
        "submit",
        sendMessage
    );


    document
        .querySelectorAll("[data-reaction]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const reaction =
                        button.dataset.reaction;

                    sendReaction(reaction);
                }
            );
        });


    /* -----------------------------------------------------
       FECHAR MODAL
       ----------------------------------------------------- */

    videoModal?.addEventListener(
        "click",
        event => {

            if (
                event.target === videoModal
            ) {
                hideElement(videoModal);
            }
        }
    );


    /* -----------------------------------------------------
       TECLAS
       ----------------------------------------------------- */

    createName?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                createRoom();
            }
        }
    );


    roomName?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                createRoom();
            }
        }
    );


    joinName?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                joinRoom();
            }
        }
    );


    roomCode?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                joinRoom();
            }
        }
    );


    /* -----------------------------------------------------
       VIDEO
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
}


/* =========================================================
   AUTENTICAÇÃO
   ========================================================= */

async function ensureUser() {

    if (!supabaseClient) {
        throw new Error(
            "Supabase não está inicializado."
        );
    }


    if (state.userId) {
        return state.userId;
    }


    log("🔐 Criando sessão anônima...");


    const {
        data,
        error
    } = await supabaseClient.auth.signInAnonymously();


    if (error) {

        console.error(
            "❌ Erro no login anônimo:",
            error
        );

        throw new Error(
            "Não foi possível criar sua sessão. Verifique se o login anônimo está ativado no Supabase."
        );
    }


    if (!data?.user?.id) {

        throw new Error(
            "Supabase não retornou o ID do usuário."
        );
    }


    state.userId =
        data.user.id;


    log(
        "✅ Usuário autenticado:",
        state.userId
    );


    return state.userId;
}


/* =========================================================
   GERAR CÓDIGO DA SALA
   ========================================================= */

function generateRoomCode(length = 6) {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (
        let i = 0;
        i < length;
        i++
    ) {

        code += characters.charAt(
            Math.floor(
                Math.random() *
                characters.length
            )
        );
    }

    return code;
}


/* =========================================================
   CRIAR SALA
   ========================================================= */

async function createRoom() {

    clearError(createError);


    const name =
        createName?.value.trim();

    const roomNameValue =
        roomName?.value.trim();


    if (!name) {

        showError(
            createError,
            "Digite seu nome."
        );

        createName?.focus();

        return;
    }


    if (!roomNameValue) {

        showError(
            createError,
            "Digite o nome da sala."
        );

        roomName?.focus();

        return;
    }


    try {

        setConnectionStatus(
            "connecting",
            "Criando sala..."
        );


        await ensureUser();


        let room = null;

        let attempts = 0;


        while (!room && attempts < 5) {

            attempts++;


            const code =
                generateRoomCode();


            const {
                data,
                error
            } = await supabaseClient
                .from("rooms")
                .insert({
                    name: roomNameValue,
                    code: code,
                    owner_id: state.userId,
                    is_private:
                        roomPrivate?.checked ?? false,
                    is_active: true
                })
                .select()
                .single();


            if (!error) {

                room = data;

                break;
            }


            console.warn(
                "⚠️ Tentativa de criação:",
                error
            );
        }


        if (!room) {

            throw new Error(
                "Não foi possível criar a sala. Verifique se a tabela 'rooms' existe no Supabase e se as políticas RLS estão configuradas."
            );
        }


        state.userName = name;
        state.room = room;
        state.roomId = room.id;
        state.isHost = true;


        await addMember();


        openRoom();


        setConnectionStatus(
            "connected",
            "Online"
        );


        showToast(
            "🎉 Sala criada com sucesso!"
        );


        log(
            "🏠 Sala criada:",
            room
        );

    } catch (error) {

        console.error(
            "❌ Erro ao criar sala:",
            error
        );


        showError(
            createError,
            error.message ||
            "Erro ao criar sala."
        );


        setConnectionStatus(
            "error",
            "Erro"
        );
    }
}


/* =========================================================
   ENTRAR NA SALA
   ========================================================= */

async function joinRoom() {

    clearError(joinError);


    const name =
        joinName?.value.trim();

    const code =
        roomCode?.value
            .trim()
            .toUpperCase();


    if (!name) {

        showError(
            joinError,
            "Digite seu nome."
        );

        joinName?.focus();

        return;
    }


    if (!code) {

        showError(
            joinError,
            "Digite o código da sala."
        );

        roomCode?.focus();

        return;
    }


    try {

        setConnectionStatus(
            "connecting",
            "Entrando na sala..."
        );


        await ensureUser();


        const {
            data: room,
            error
        } = await supabaseClient
            .from("rooms")
            .select("*")
            .eq("code", code)
            .eq("is_active", true)
            .maybeSingle();


        if (error) {

            console.error(
                "❌ Erro ao procurar sala:",
                error
            );

            throw new Error(
                error.message
            );
        }


        if (!room) {

            throw new Error(
                "Sala não encontrada ou encerrada."
            );
        }


        state.userName = name;
        state.room = room;
        state.roomId = room.id;
        state.isHost =
            room.owner_id === state.userId;


        await addMember();


        /* IMPORTANTE:
           openRoom() já chama loadRoomData().
           Não carregamos novamente aqui.
        */

        openRoom();


        setConnectionStatus(
            "connected",
            "Online"
        );


        showToast(
            "🎬 Você entrou na sala!"
        );


    } catch (error) {

        console.error(
            "❌ Erro ao entrar:",
            error
        );


        showError(
            joinError,
            error.message ||
            "Erro ao entrar na sala."
        );


        setConnectionStatus(
            "error",
            "Erro"
        );
    }
}


/* =========================================================
   ADICIONAR MEMBRO
   ========================================================= */

async function addMember() {

    if (
        !state.roomId ||
        !state.userId
    ) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("room_members")
        .upsert(
            {
                room_id: state.roomId,
                user_id: state.userId,
                display_name: state.userName,
                is_online: true,
                last_seen: new Date().toISOString()
            },
            {
                onConflict:
                    "room_id,user_id"
            }
        );


    if (error) {

        console.error(
            "❌ Erro ao adicionar membro:",
            error
        );

        throw new Error(
            "Não foi possível entrar como participante: " +
            error.message
        );
    }


    log("👤 Participante adicionado.");
}


/* =========================================================
   ABRIR SALA
   ========================================================= */

async function openRoom() {

    hideElement(homeScreen);
    showElement(roomScreen);


    setText(
        roomTitle,
        state.room?.name || "Sala"
    );


    setText(
        roomCodeDisplay,
        state.room?.code || ""
    );


    setText(
        hostStatus,
        state.isHost
            ? "👑 Você é o anfitrião"
            : "👤 Participante"
    );


    try {

        await loadRoomData();

        await subscribeRealtime();

        startHeartbeat();


        setConnectionStatus(
            "connected",
            "Online"
        );


    } catch (error) {

        console.error(
            "❌ Erro ao abrir sala:",
            error
        );


        showToast(
            "Erro ao carregar os dados da sala."
        );
    }
}


/* =========================================================
   CARREGAR DADOS DA SALA
   ========================================================= */

async function loadRoomData() {

    await Promise.all([
        loadParticipants(),
        loadPlaylist(),
        loadMessages()
    ]);
}


/* =========================================================
   PARTICIPANTES
   ========================================================= */

async function loadParticipants() {

    if (!state.roomId) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("room_members")
        .select("*")
        .eq("room_id", state.roomId)
        .order(
            "created_at",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "❌ Erro ao carregar participantes:",
            error
        );

        return;
    }


    state.participants =
        data || [];


    renderParticipants();
}


/* =========================================================
   RENDERIZAR PARTICIPANTES
   ========================================================= */

function renderParticipants() {

    if (!participants) {
        return;
    }


    participants.innerHTML = "";


    state.participants.forEach(
        member => {

            const item =
                document.createElement("div");


            item.className =
                "participant-item";


            const online =
                member.is_online;


            item.innerHTML = `
                <span class="participant-status ${online ? "online" : ""}"></span>
                <span class="participant-name">
                    ${escapeHtml(member.display_name)}
                </span>
            `;


            participants.appendChild(item);
        }
    );


    setText(
        participantCount,
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


    const {
        data,
        error
    } = await supabaseClient
        .from("playlist_items")
        .select("*")
        .eq("room_id", state.roomId)
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
            "❌ Erro ao carregar playlist:",
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
}


/* =========================================================
   RENDERIZAR PLAYLIST
   ========================================================= */

function renderPlaylist() {

    if (!playlist) {
        return;
    }


    playlist.innerHTML = "";


    state.playlist.forEach(
        item => {

            const element =
                document.createElement("div");


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
                        ${escapeHtml(item.title)}
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
                .querySelector(".playlist-play")
                ?.addEventListener(
                    "click",
                    () => loadVideo(item)
                );


            element
                .querySelector(".playlist-delete")
                ?.addEventListener(
                    "click",
                    () => removePlaylistItem(item)
                );


            playlist.appendChild(element);
        }
    );
}


/* =========================================================
   ADICIONAR VÍDEO
   ========================================================= */

async function addVideo() {

    clearError(videoError);


    const title =
        videoTitle?.value.trim();

    const url =
        videoUrl?.value.trim();


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
        } = await supabaseClient
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

                /* CORREÇÃO IMPORTANTE */
                added_by:
                    state.userId

            })
            .select()
            .single();


        if (error) {

            console.error(
                "❌ Erro ao adicionar vídeo:",
                error
            );

            throw new Error(
                error.message
            );
        }


        state.playlist.push(data);


        renderPlaylist();


        if (!state.currentVideoId) {
            loadVideo(data);
        }


        if (videoTitle) {
            videoTitle.value = "";
        }


        if (videoUrl) {
            videoUrl.value = "";
        }


        hideElement(videoModal);


        showToast(
            "🎬 Vídeo adicionado!"
        );


    } catch (error) {

        console.error(
            "❌ Erro ao adicionar vídeo:",
            error
        );


        showError(
            videoError,
            error.message ||
            "Erro ao adicionar vídeo."
        );
    }
}


/* =========================================================
   REMOVER ITEM DA PLAYLIST
   ========================================================= */

async function removePlaylistItem(item) {

    if (!item?.id) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from("playlist_items")
            .delete()
            .eq("id", item.id);


        if (error) {
            throw new Error(
                error.message
            );
        }


        state.playlist =
            state.playlist.filter(
                video =>
                    video.id !== item.id
            );


        renderPlaylist();


        showToast(
            "Vídeo removido."
        );


    } catch (error) {

        console.error(
            "❌ Erro ao remover vídeo:",
            error
        );


        showToast(
            "Não foi possível remover o vídeo."
        );
    }
}


/* =========================================================
   CARREGAR VÍDEO
   ========================================================= */

function loadVideo(item) {

    if (!item) {
        return;
    }


    state.currentVideoId =
        item.id;


    renderPlaylist();


    if (!videoPlayer) {
        return;
    }


    hideElement(videoPlaceholder);
    showElement(videoPlayer);


    state.ignoreVideoEvent = true;


    try {

        videoPlayer.src =
            item.video_url;


        videoPlayer.load();


    } catch (error) {

        console.error(
            "❌ Erro ao carregar vídeo:",
            error
        );
    }


    setTimeout(
        () => {
            state.ignoreVideoEvent = false;
        },
        500
    );


    log(
        "🎬 Vídeo carregado:",
        item.title
    );
}


/* =========================================================
   VIDEO PLAY
   ========================================================= */

async function handleVideoPlay() {

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
                videoPlayer?.currentTime || 0
        }
    );
}


/* =========================================================
   VIDEO PAUSE
   ========================================================= */

async function handleVideoPause() {

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
                videoPlayer?.currentTime || 0
        }
    );
}


/* =========================================================
   VIDEO SEEK
   ========================================================= */

function handleVideoSeek() {

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
                videoPlayer?.currentTime || 0
        }
    );
}


/* =========================================================
   BROADCAST PLAYER
   ========================================================= */

function broadcastPlayer(
    action,
    data = {}
) {

    if (!state.channel) {
        return;
    }


    state.channel.send({
        type: "broadcast",
        event: "player",
        payload: {
            userId:
                state.userId,

            action:
                action,

            ...data
        }
    });
}


/* =========================================================
   APLICAR SINCRONIZAÇÃO
   ========================================================= */

async function applyPlayerEvent(payload) {

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


    state.ignoreVideoEvent = true;


    try {

        if (
            typeof payload.time ===
            "number"
        ) {

            videoPlayer.currentTime =
                payload.time;
        }


        if (
            payload.action ===
            "play"
        ) {

            try {

                await videoPlayer.play();

            } catch (error) {

                console.warn(
                    "⚠️ Reprodução automática bloqueada pelo navegador.",
                    error
                );


                showToast(
                    "Clique no vídeo para iniciar a reprodução."
                );
            }
        }


        if (
            payload.action ===
            "pause"
        ) {

            videoPlayer.pause();
        }


        if (
            payload.action ===
            "seek"
        ) {

            /* Apenas sincroniza o tempo */
        }


    } catch (error) {

        console.error(
            "❌ Erro na sincronização:",
            error
        );

    } finally {

        setTimeout(
            () => {
                state.ignoreVideoEvent = false;
            },
            300
        );
    }
}


/* =========================================================
   REALTIME
   ========================================================= */

async function subscribeRealtime() {

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

        state.channel = null;
    }


    const channelName =
        `room-${state.roomId}`;


    state.channel =
        supabaseClient.channel(
            channelName
        );


    /* -----------------------------------------------------
       BROADCAST
       ----------------------------------------------------- */

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

            showReaction(
                payload?.reaction
            );
        }
    );


    /* -----------------------------------------------------
       MENSAGENS
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       PARTICIPANTES
       ----------------------------------------------------- */

    state.channel.on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "room_members",
            filter:
                `room_id=eq.${state.roomId}`
        },
        async () => {

            await loadParticipants();
        }
    );


    /* -----------------------------------------------------
       PLAYLIST
       ----------------------------------------------------- */

    state.channel.on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "playlist_items",
            filter:
                `room_id=eq.${state.roomId}`
        },
        async () => {

            await loadPlaylist();
        }
    );


    const status =
        await state.channel.subscribe(
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

                } else if (
                    status ===
                    "CHANNEL_ERROR"
                ) {

                    setConnectionStatus(
                        "error",
                        "Realtime indisponível"
                    );

                } else if (
                    status ===
                    "TIMED_OUT"
                ) {

                    setConnectionStatus(
                        "error",
                        "Conexão expirou"
                    );
                }
            }
        );


    return status;
}


/* =========================================================
   CHAT
   ========================================================= */

async function sendMessage(event) {

    event?.preventDefault();


    const message =
        chatInput?.value.trim();


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
            error
        } = await supabaseClient
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
            });


        if (error) {

            throw new Error(
                error.message
            );
        }


        chatInput.value = "";


    } catch (error) {

        console.error(
            "❌ Erro ao enviar mensagem:",
            error
        );


        showToast(
            "Não foi possível enviar a mensagem."
        );
    }
}


/* =========================================================
   CARREGAR MENSAGENS
   ========================================================= */

async function loadMessages() {

    if (!state.roomId) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("messages")
        .select("*")
        .eq("room_id", state.roomId)
        .order(
            "created_at",
            {
                ascending: true
            }
        )
        .limit(100);


    if (error) {

        console.error(
            "❌ Erro ao carregar mensagens:",
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
}


/* =========================================================
   ADICIONAR MENSAGEM NA TELA
   ========================================================= */

function appendMessage(
    message,
    scroll = true
) {

    if (!chatMessages || !message) {
        return;
    }


    /* Evita duplicar mensagens */
    const existing =
        chatMessages.querySelector(
            `[data-message-id="${message.id}"]`
        );


    if (existing) {
        return;
    }


    const element =
        document.createElement("div");


    element.className =
        "chat-message";


    element.dataset.messageId =
        message.id;


    element.innerHTML = `
        <strong>
            ${escapeHtml(message.display_name)}
        </strong>

        <span>
            ${escapeHtml(message.message)}
        </span>
    `;


    chatMessages.appendChild(
        element
    );


    if (scroll) {
        scrollChat();
    }
}


/* =========================================================
   SCROLL CHAT
   ========================================================= */

function scrollChat() {

    if (!chatMessages) {
        return;
    }


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* =========================================================
   REAÇÕES
   ========================================================= */

function sendReaction(reaction) {

    if (
        !state.channel ||
        !reaction
    ) {
        return;
    }


    state.channel.send({
        type: "broadcast",
        event: "reaction",
        payload: {
            userId:
                state.userId,

            reaction:
                reaction
        }
    });


    showReaction(reaction);
}


/* =========================================================
   MOSTRAR REAÇÃO
   ========================================================= */

function showReaction(reaction) {

    if (!reaction) {
        return;
    }


    const element =
        document.createElement("div");


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


/* =========================================================
   ATUALIZAR HEARTBEAT
   ========================================================= */

async function updateHeartbeat() {

    if (
        !state.roomId ||
        !state.userId
    ) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("room_members")
        .update({
            is_online: true,
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
            "⚠️ Erro no heartbeat:",
            error
        );
    }
}


/* =========================================================
   PARAR HEARTBEAT
   ========================================================= */

function stopHeartbeat() {

    if (state.heartbeat) {

        clearInterval(
            state.heartbeat
        );

        state.heartbeat = null;
    }
}


/* =========================================================
   SAIR DA SALA
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
                    is_online: false,
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

            state.channel = null;
        }


    } catch (error) {

        console.warn(
            "⚠️ Erro ao sair:",
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


    showElement(homeScreen);
    hideElement(roomScreen);


    setConnectionStatus(
        "connected",
        "Online"
    );


    showToast(
        "Você saiu da sala."
    );
}


/* =========================================================
   COPIAR LINK
   ========================================================= */

async function copyRoomURL() {

    if (!state.room?.code) {
        return;
    }


    const url =
        `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(state.room.code)}`;


    try {

        await navigator.clipboard.writeText(
            url
        );


        showToast(
            "🔗 Link copiado!"
        );


    } catch (error) {

        console.error(
            "❌ Erro ao copiar:",
            error
        );


        window.prompt(
            "Copie o link da sala:",
            url
        );
    }
}


/* =========================================================
   VERIFICAR ROOM NA URL
   ========================================================= */

function checkRoomFromURL() {

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
        code.trim().toUpperCase();


    if (roomCode) {
        roomCode.value =
            normalizedCode;
    }


    showElement(joinPanel);
    hideElement(createPanel);


    log(
        "🔗 Código encontrado na URL:",
        normalizedCode
    );
}


/* =========================================================
   STATUS DA CONEXÃO
   ========================================================= */

function setConnectionStatus(
    type,
    text
) {

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


    connectionDot.classList.add(
        type
    );
}


/* =========================================================
   ERROS
   ========================================================= */

function showError(
    element,
    message
) {

    if (!element) {
        return;
    }


    element.textContent =
        message || "Erro";


    element.style.display =
        "";
}


function clearError(element) {

    if (!element) {
        return;
    }


    element.textContent = "";

    element.style.display =
        "none";
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    if (!toastElement) {

        console.log(
            "Toast:",
            message
        );

        return;
    }


    toastElement.textContent =
        message;


    toastElement.classList.add(
        "show"
    );


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
}


/* =========================================================
   LIMPEZA AO FECHAR A PÁGINA
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
                    is_online: false,
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

    loadRoomData,

    subscribeRealtime
};


log("📡 script.js carregado.");
