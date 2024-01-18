const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const MUSIC_STORAGE_KEY = 'axitzi_music';

// Obtener el estado guardado del almacenamiento local
const savedMusicState = JSON.parse(localStorage.getItem(MUSIC_STORAGE_KEY));

let musicIndex = (savedMusicState && savedMusicState.musicIndex) ? savedMusicState.musicIndex : 0;
let currentTime = (savedMusicState && savedMusicState.currentTime) ? savedMusicState.currentTime : 0;
let isPlaying = false;

const music = new Audio();

const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'Monaco',
        cover: 'assets/1.jpg',
        artist: 'Bad Bunny',
    },
    {
        path: 'assets/2.mp3',
        displayName: 'Rompe la dompe',
        cover: 'assets/2.jpg',
        artist: 'Oscar Maydon x Peso Pluma',
    },
    {
        path: 'assets/3.mp3',
        displayName: 'La victima',
        cover: 'assets/3.jpg',
        artist: 'Xavi',
    },
    {
        path: 'assets/4.mp3',
        displayName: 'Estos Celos',
        cover: 'assets/4.jpg',
        artist: 'Vicente Fernandez',
    }
];

function saveMusicState() {
    // Guardar el estado actual en el almacenamiento local
    localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify({
        musicIndex,
        currentTime
    }));
}

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    // Cambiar el icono del botón de reproducción
    playBtn.classList.replace('fa-play', 'fa-pause');
    // Establecer el título de información al pasar el mouse
    playBtn.setAttribute('title', 'Pause');
    music.play();
    music.currentTime = currentTime; // Reproducir en el segundo exacto
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
    saveMusicState();
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
    saveMusicState();
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
    updateProgressBar(); // Actualizar la barra de progreso después de cambiar manualmente
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

// Cargar la información de la canción y el tiempo de reproducción guardado
loadMusic(songs[musicIndex]);

