/* =========================================================
   ALIEN WATCH PARTY
   V2
   Supabase + Realtime
========================================================= */


/* =========================================================
   CONFIGURAÇÃO SUPABASE
=========================================================

   COLOQUE AQUI OS DADOS DO SEU PROJETO SUPABASE.

   Supabase:
   Project Settings
   -> API

========================================================= */

const SUPABASE_URL = "COLE_SUA_URL_AQUI";

const SUPABASE_ANON_KEY = "COLE_SUA_ANON_KEY_AQUI";


/* =========================================================
   CLIENTE
========================================================= */

let supabaseClient = null;

if (
    SUPABASE_URL !== "COLE_SUA_URL_AQUI" &&
    SUPABASE_ANON_KEY !== "COLE_SUA_ANON_KEY_AQUI"
) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );
}


/* =========================================================
   ESTADO
========================================================= */

const state = {

    userId: null,

    userName: null,

    room: null,

    roomId: null,

    isHost: false,

    participants: new Map(),

    playlist: [],

    currentVideoId: null,

    channel: null,

    lastSync: 0,

    ignoreVideoEvent: false,

    heartbeat: null

};


/* =========================================================
   ELEMENTOS
========================================================= */

const $ = (id) =>
    document.getElementById(id);


const homeScreen =
    $("homeScreen");

const roomScreen =
    $("roomScreen");

const videoPlayer =
    $("videoPlayer");

const videoPlaceholder =
    $("videoPlaceholder");

const playlistElement =
    $("playlist");

const participantsElement =
    $("participants");

const chatMessages =
    $("chatMessages");


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


async function init() {

    setupButtons();

    checkRoomFromURL();

    if (!supabaseClient) {

        setConnection(
            false,
            "Configure o Supabase"
        );

        console.warn(
            "Supabase ainda não configurado."
        );

        return;
    }


    setConnection(
        false,
        "Conectando..."
    );


    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    if (user) {

        state.userId =
            user.id;

    }


    setConnection(
        true,
        "Online"
    );
}


/* =========================================================
   BOTÕES
========================================================= */

function setupButtons() {


    $("showCreateRoom")
        .addEventListener(
            "click",
            () => {

                openPanel(
                    "createPanel"
                );

            }
        );


    $("showJoinRoom")
        .addEventListener(
            "click",
            () => {

                openPanel(
                    "joinPanel"
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

                        closePanel(
                            button.dataset.close
                        );

                    }
                );

            }
        );


    $("createRoomBtn")
        .addEventListener(
            "click",
            createRoom
        );


    $("joinRoomBtn")
        .addEventListener(
            "click",
            joinRoom
        );


    $("leaveRoomBtn")
        .addEventListener(
            "click",
            leaveRoom
        );


    $("copyRoomLink")
        .addEventListener(
            "click",
            copyRoomLink
        );


    $("showAddVideo")
        .addEventListener(
            "click",
            () => {

                openPanel(
                    "videoModal"
                );

            }
        );


    $("addVideoBtn")
        .addEventListener(
            "click",
            addVideo
        );


    $("chatForm")
        .addEventListener(
            "submit",
            sendChat
        );


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


    videoPlayer
        .addEventListener(
            "play",
            handlePlay
        );


    videoPlayer
        .addEventListener(
            "pause",
            handlePause
        );


    videoPlayer
        .addEventListener(
            "seeked",
            handleSeek
        );


    videoPlayer
        .addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

}


/* =========================================================
   PAINÉIS
========================================================= */

function openPanel(id) {

    $(id)
        .classList
        .remove("hidden");

}


function closePanel(id) {

    $(id)
        .classList
        .add("hidden");

}


/* =========================================================
   CONEXÃO
========================================================= */

function setConnection(
    online,
    text
) {

    const dot =
        $("connectionDot");

    const label =
        $("connectionText");


    dot.classList.toggle(
        "online",
        online
    );


    label.textContent =
        text;
}


/* =========================================================
   URL DA SALA
========================================================= */

function checkRoomFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const roomCode =
        params.get("room");


    if (roomCode) {

        $("roomCode")
            .value =
            roomCode.toUpperCase();

        openPanel(
            "joinPanel"
        );

    }

}


/* =========================================================
   GERAR CÓDIGO
========================================================= */

function generateRoomCode() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let code = "";


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        code +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];

    }


    return code;
}


/* =========================================================
   CRIAR SALA
========================================================= */

async function createRoom() {

    if (!supabaseClient) {

        showError(
            "createError",
            "Configure primeiro o Supabase."
        );

        return;
    }


    const name =
        $("createName")
            .value
            .trim();


    const roomName =
        $("roomName")
            .value
            .trim();


    if (!name) {

        showError(
            "createError",
            "Digite seu nome."
        );

        return;
    }


    if (!roomName) {

        showError(
            "createError",
            "Digite o nome da sala."
        );

        return;
    }


    try {

        state.userName =
            name;


        await ensureUser();


        const code =
            generateRoomCode();


        const isPrivate =
            $("roomPrivate")
                .checked;


        const {
            data,
            error
        } =
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
                        isPrivate

                })
                .select()
                .single();


        if (error)
            throw error;


        state.room =
            data;

        state.roomId =
            data.id;

        state.isHost =
            true;


        await addMember();


        openRoom();


    } catch (error) {

        console.error(error);

        showError(
            "createError",
            error.message
        );

    }

}


/* =========================================================
   ENTRAR NA SALA
========================================================= */

async function joinRoom() {

    if (!supabaseClient) {

        showError(
            "joinError",
            "Configure primeiro o Supabase."
        );

        return;
    }


    const name =
        $("joinName")
            .value
            .trim();


    const code =
        $("roomCode")
            .value
            .trim()
            .toUpperCase();


    if (!name) {

        showError(
            "joinError",
            "Digite seu nome."
        );

        return;
    }


    if (code.length !== 6) {

        showError(
            "joinError",
            "Código inválido."
        );

        return;
    }


    try {

        state.userName =
            name;


        await ensureUser();


        const {
            data,
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
                .single();


        if (error)
            throw new Error(
                "Sala não encontrada."
            );


        state.room =
            data;

        state.roomId =
            data.id;

        state.isHost =
            data.owner_id ===
            state.userId;


        await addMember();


        await loadRoomData();


        openRoom();


    } catch (error) {

        console.error(error);

        showError(
            "joinError",
            error.message
        );

    }

}


/* =========================================================
   USUÁRIO ANÔNIMO
========================================================= */

async function ensureUser() {

    if (state.userId)
        return;


    const {
        data,
        error
    } =
        await supabaseClient.auth
            .signInAnonymously();


    if (error)
        throw error;


    state.userId =
        data.user.id;

}


/* =========================================================
   ADICIONAR MEMBRO
========================================================= */

async function addMember() {

    const {
        error
    } =
        await supabaseClient
            .from("room_members")
            .upsert({

                room_id:
                    state.roomId,

                user_id:
                    state.userId,

                display_name:
                    state.userName,

                is_online:
                    true,

                last_seen:
                    new Date()
                        .toISOString()

            }, {

                onConflict:
                    "room_id,user_id"

            });


    if (error)
        throw error;

}


/* =========================================================
   ABRIR SALA
========================================================= */

async function openRoom() {

    homeScreen
        .classList
        .add("hidden");


    roomScreen
        .classList
        .remove("hidden");


    $("roomTitle")
        .textContent =
        state.room.name;


    $("roomCodeDisplay")
        .textContent =
        state.room.code;


    updateHostUI();


    await loadRoomData();

    subscribeRealtime();

    startHeartbeat();

}


/* =========================================================
   CARREGAR DADOS
========================================================= */

async function loadRoomData() {

    await loadParticipants();

    await loadPlaylist();

    await loadMessages();

}


/* =========================================================
   PARTICIPANTES
========================================================= */

async function loadParticipants() {

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
            .eq(
                "is_online",
                true
            )
            .order(
                "created_at"
            );


    if (error) {

        console.error(error);

        return;
    }


    state.participants.clear();


    data.forEach(
        member => {

            state.participants.set(
                member.user_id,
                member
            );

        }
    );


    renderParticipants();

}


/* =========================================================
   RENDER PARTICIPANTES
========================================================= */

function renderParticipants() {

    participantsElement.innerHTML = "";


    state.participants
        .forEach(
            member => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "participant";


                const avatar =
                    document.createElement(
                        "div"
                    );


                avatar.className =
                    "avatar";


                avatar.textContent =
                    member.display_name
                        .charAt(0)
                        .toUpperCase();


                const name =
                    document.createElement(
                        "div"
                    );


                name.className =
                    "participant-name";


                name.textContent =
                    member.display_name;


                div.appendChild(
                    avatar
                );

                div.appendChild(
                    name
                );


                if (
                    member.user_id ===
                    state.room.owner_id
                ) {

                    const badge =
                        document.createElement(
                            "span"
                        );


                    badge.className =
                        "host-badge";


                    badge.textContent =
                        "👑";


                    div.appendChild(
                        badge
                    );

                }


                participantsElement
                    .appendChild(
                        div
                    );

            }
        );


    $("participantCount")
        .textContent =
        state.participants.size;

}


/* =========================================================
   PLAYLIST
========================================================= */

async function loadPlaylist() {

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
            );


    if (error) {

        console.error(error);

        return;
    }


    state.playlist =
        data || [];


    renderPlaylist();


    if (
        state.playlist.length &&
        !state.currentVideoId
    ) {

        state.currentVideoId =
            state.playlist[0].id;


        loadVideo(
            state.playlist[0],
            false
        );

    }

}


/* =========================================================
   RENDER PLAYLIST
========================================================= */

function renderPlaylist() {

    playlistElement.innerHTML = "";


    if (
        !state.playlist.length
    ) {

        playlistElement.innerHTML =
            `<div class="empty-playlist">
                Nenhum vídeo adicionado.
             </div>`;

        return;
    }


    state.playlist
        .forEach(
            (item, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "playlist-item";


                if (
                    item.id ===
                    state.currentVideoId
                ) {

                    div.classList.add(
                        "active"
                    );

                }


                const number =
                    document.createElement(
                        "div"
                    );


                number.className =
                    "playlist-number";


                number.textContent =
                    index + 1;


                const info =
                    document.createElement(
                        "div"
                    );


                info.className =
                    "playlist-info";


                const title =
                    document.createElement(
                        "div"
                    );


                title.className =
                    "playlist-title";


                title.textContent =
                    item.title;


                const url =
                    document.createElement(
                        "div"
                    );


                url.className =
                    "playlist-url";


                url.textContent =
                    item.video_url;


                info.appendChild(
                    title
                );

                info.appendChild(
                    url
                );


                const remove =
                    document.createElement(
                        "button"
                    );


                remove.className =
                    "remove-video";


                remove.textContent =
                    "🗑️";


                remove.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        removeVideo(
                            item.id
                        );

                    }
                );


                div.appendChild(
                    number
                );

                div.appendChild(
                    info
                );

                div.appendChild(
                    remove
                );


                div.addEventListener(
                    "click",
                    () => {

                        loadVideo(
                            item,
                            true
                        );

                    }
                );


                playlistElement
                    .appendChild(
                        div
                    );

            }
        );

}


/* =========================================================
   ADICIONAR VÍDEO
========================================================= */

async function addVideo() {

    if (!state.isHost) {

        showToast(
            "Somente o dono da sala pode adicionar vídeos."
        );

        return;
    }


    const title =
        $("videoTitle")
            .value
            .trim();


    const url =
        $("videoUrl")
            .value
            .trim();


    if (!title || !url) {

        showError(
            "videoError",
            "Preencha nome e URL."
        );

        return;
    }


    const position =
        state.playlist.length;


    const {
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
                    position

            });


    if (error) {

        showError(
            "videoError",
            error.message
        );

        return;
    }


    $("videoTitle").value = "";

    $("videoUrl").value = "";


    closePanel(
        "videoModal"
    );


    await loadPlaylist();


    showToast(
        "Vídeo adicionado!"
    );

}


/* =========================================================
   REMOVER VÍDEO
========================================================= */

async function removeVideo(id) {

    if (!state.isHost) {

        showToast(
            "Somente o dono pode remover vídeos."
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("playlist_items")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        showToast(
            error.message
        );

        return;
    }


    if (
        state.currentVideoId ===
        id
    ) {

        state.currentVideoId =
            null;

        videoPlayer.pause();

        videoPlayer.removeAttribute(
            "src"
        );

        videoPlayer.load();

        videoPlaceholder
            .classList
            .remove("hidden");

    }


    await loadPlaylist();

}


/* =========================================================
   CARREGAR VÍDEO
========================================================= */

async function loadVideo(
    item,
    broadcast = true
) {

    state.currentVideoId =
        item.id;


    renderPlaylist();


    state.ignoreVideoEvent =
        true;


    videoPlayer.src =
        item.video_url;


    videoPlayer.load();


    videoPlaceholder
        .classList
        .add("hidden");


    videoPlayer.currentTime =
        0;


    setTimeout(
        () => {

            state.ignoreVideoEvent =
                false;

        },
        500
    );


    if (broadcast) {

        await broadcastState(
            "video",
            {
                videoId:
                    item.id,

                time:
                    0,

                playing:
                    false
            }
        );

    }

}


/* =========================================================
   PLAY
========================================================= */

async function handlePlay() {

    if (
        state.ignoreVideoEvent ||
        !state.isHost
    )
        return;


    await broadcastState(
        "play",
        {
            videoId:
                state.currentVideoId,

            time:
                videoPlayer.currentTime,

            playing:
                true
        }
    );

}


/* =========================================================
   PAUSE
========================================================= */

async function handlePause() {

    if (
        state.ignoreVideoEvent ||
        !state.isHost
    )
        return;


    await broadcastState(
        "pause",
        {
            videoId:
                state.currentVideoId,

            time:
                videoPlayer.currentTime,

            playing:
                false
        }
    );

}


/* =========================================================
   SEEK
========================================================= */

async function handleSeek() {

    if (
        state.ignoreVideoEvent ||
        !state.isHost
    )
        return;


    await broadcastState(
        "seek",
        {
            videoId:
                state.currentVideoId,

            time:
                videoPlayer.currentTime,

            playing:
                !videoPlayer.paused
        }
    );

}


/* =========================================================
   TIME UPDATE
========================================================= */

function handleTimeUpdate() {

    if (!state.isHost)
        return;


    const now =
        Date.now();


    if (
        now -
        state.lastSync <
        5000
    )
        return;


    state.lastSync =
        now;

}


/* =========================================================
   TRANSMITIR ESTADO
========================================================= */

async function broadcastState(
    action,
    payload
) {

    if (!state.channel)
        return;


    await state.channel.send({

        type:
            "broadcast",

        event:
            "player",

        payload: {

            action:
                action,

            ...payload

        }

    });

}


/* =========================================================
   APLICAR ESTADO RECEBIDO
========================================================= */

async function applyPlayerState(
    payload
) {

    if (state.isHost)
        return;


    state.ignoreVideoEvent =
        true;


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

            state.currentVideoId =
                item.id;

            videoPlayer.src =
                item.video_url;

            videoPlayer.load();

            videoPlaceholder
                .classList
                .add("hidden");

        }

    }


    if (
        Number.isFinite(
            payload.time
        )
    ) {

        try {

            videoPlayer.currentTime =
                payload.time;

        } catch {}

    }


    if (
        payload.playing
    ) {

        try {

            await videoPlayer.play();

        } catch {

            showToast(
                "Clique no player para permitir a reprodução."
            );

        }

    } else {

        videoPlayer.pause();

    }


    renderPlaylist();


    setTimeout(
        () => {

            state.ignoreVideoEvent =
                false;

        },
        500
    );

}


/* =========================================================
   REALTIME
========================================================= */

function subscribeRealtime() {

    if (state.channel) {

        supabaseClient
            .removeChannel(
                state.channel
            );

    }


    state.channel =
        supabaseClient
            .channel(
                `room-${state.roomId}`
            );


    state.channel
        .on(
            "broadcast",
            {
                event:
                    "player"
            },
            payload => {

                applyPlayerState(
                    payload.payload
                );

            }
        )
        .on(
            "broadcast",
            {
                event:
                    "reaction"
            },
            payload => {

                showReaction(
                    payload.payload.reaction
                );

            }
        )
        .on(
            "postgres_changes",
            {
                event:
                    "*",

                schema:
                    "public",

                table:
                    "messages",

                filter:
                    `room_id=eq.${state.roomId}`

            },
            payload => {

                if (
                    payload.eventType ===
                    "INSERT"
                ) {

                    addChatMessage(
                        payload.new
                    );

                }

            }
        )
        .on(
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
        )
        .on(
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
        )
        .subscribe(
            status => {

                if (
                    status ===
                    "SUBSCRIBED"
                ) {

                    setConnection(
                        true,
                        "Realtime conectado"
                    );

                }

            }
        );

}


/* =========================================================
   CHAT
========================================================= */

async function sendChat(event) {

    event.preventDefault();


    const input =
        $("chatInput");


    const message =
        input.value.trim();


    if (!message)
        return;


    const {
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

            });


    if (error) {

        showToast(
            error.message
        );

        return;
    }


    input.value = "";

}


/* =========================================================
   CARREGAR CHAT
========================================================= */

async function loadMessages() {

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


    if (error)
        return;


    chatMessages.innerHTML = "";


    data.forEach(
        message => {

            addChatMessage(
                message
            );

        }
    );

}


/* =========================================================
   ADICIONAR MENSAGEM
========================================================= */

function addChatMessage(
    message
) {

    if (
        document.querySelector(
            `[data-message-id="${message.id}"]`
        )
    )
        return;


    const div =
        document.createElement(
            "div"
        );


    div.className =
        "chat-message";


    div.dataset.messageId =
        message.id;


    const name =
        document.createElement(
            "strong"
        );


    name.textContent =
        message.display_name;


    const text =
        document.createElement(
            "p"
        );


    text.textContent =
        message.message;


    div.appendChild(
        name
    );

    div.appendChild(
        text
    );


    chatMessages.appendChild(
        div
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =========================================================
   REAÇÕES
========================================================= */

async function sendReaction(
    reaction
) {

    if (!state.channel)
        return;


    await state.channel.send({

        type:
            "broadcast",

        event:
            "reaction",

        payload: {

            reaction:
                reaction,

            user:
                state.userName

        }

    });


    showReaction(
        reaction
    );

}


function showReaction(
    reaction
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        reaction;


    element.style.position =
        "fixed";


    element.style.left =
        Math.random() * 90 + "%";


    element.style.bottom =
        "100px";


    element.style.fontSize =
        "35px";


    element.style.zIndex =
        "2000";


    document.body
        .appendChild(
            element
        );


    element.animate(

        [
            {
                transform:
                    "translateY(0)",
                opacity: 1
            },

            {
                transform:
                    "translateY(-300px)",
                opacity: 0
            }

        ],

        {
            duration:
                1800
        }

    );


    setTimeout(
        () => {

            element.remove();

        },
        1800
    );

}


/* =========================================================
   HEARTBEAT
========================================================= */

function startHeartbeat() {

    if (state.heartbeat)
        clearInterval(
            state.heartbeat
        );


    updatePresence();


    state.heartbeat =
        setInterval(
            updatePresence,
            30000
        );

}


async function updatePresence() {

    if (
        !state.roomId ||
        !state.userId
    )
        return;


    await supabaseClient
        .from("room_members")
        .update({

            is_online:
                true,

            last_seen:
                new Date()
                    .toISOString()

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


/* =========================================================
   UI HOST
========================================================= */

function updateHostUI() {

    $("hostStatus")
        .textContent =
        state.isHost
            ? "👑 Você controla esta sala"
            : "👁️ Modo espectador";

}


/* =========================================================
   SAIR
========================================================= */

async function leaveRoom() {

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
                    new Date()
                        .toISOString()

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


    if (state.channel) {

        await supabaseClient
            .removeChannel(
                state.channel
            );

    }


    if (state.heartbeat) {

        clearInterval(
            state.heartbeat
        );

    }


    state.room = null;

    state.roomId = null;

    state.channel = null;

    state.playlist = [];

    state.currentVideoId = null;


    roomScreen
        .classList
        .add("hidden");


    homeScreen
        .classList
        .remove("hidden");


    history.pushState(
        {},
        "",
        window.location.pathname
    );

}


/* =========================================================
   COPIAR LINK
========================================================= */

async function copyRoomLink() {

    const url =
        `${window.location.origin}${window.location.pathname}?room=${state.room.code}`;


    try {

        await navigator.clipboard
            .writeText(url);


        showToast(
            "Link copiado!"
        );

    } catch {

        prompt(
            "Copie o link:",
            url
        );

    }

}


/* =========================================================
   ERROS
========================================================= */

function showError(
    elementId,
    message
) {

    $(elementId)
        .textContent =
        message;

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    message
) {

    const toast =
        $("toast");


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

