// OWO Music Player v0.338
// brought to you by

//                                    o8o           oooo                        .o8  
//oooo    ooo  .oooo.   ooo. .oo.   oooo   .oooo.o  888 .oo.    .ooooo.   .oooo888  
//`88.  .8'  `P  )88b  `888P"Y88b  `888  d88(  "8  888P"Y88b  d88' `88b d88' `888  
//`88..8'    .oP"888   888   888   888  `"Y88b.   888   888  888ooo888 888   888  
//`888'    d8(  888   888   888   888  o.  )88b  888   888  888    .o 888   888  
//`8'     `Y888""8o o888o o888o o888o 8""888P' o888o o888o `Y8bod8P' `Y8bod88P" 

const musicPlayer = document.querySelector("#music-player");
let isPlaying = false;
let currentSongIndex = 0;
let pausedTime = 0;

const songs = [
  {
    title: "mirage tower",
    src: "music/1.mp3",
  },
  {
    title: "how to disappear¿?¿",
    src: "music/2.mp3",
  },
  {
    title: "untitled",
    src: "music/3.mp3",
  },
  {
    title: "avoid thinking",
    src: "music/4.mp3",
  },
  {
    title: "r u ok? <3",
    src: "music/5.mp3",
  },
  {
    title: ":3 ^-^ >.< :P xD o.O uwu",
    src: "music/6.mp3",
  },
  {
    title: "waaaaaaaaaa",
    src: "music/7.mp3",
  },
  {
    title: "I really want to see you again （*＾-＾*）",
    src: "music/8.mp3",
  },
  {
    title: "ten ｡･:*:･ﾟ★｡･:*:･ﾟ☆",
    src: "music/9.mp3",
  },
  {
    title: "cursed bunny awful mix",
    src: "music/10.mp3",
  },
  {
    title: "obsessed pt II",
    src: "music/11.mp3",
  },
  {
    title: "storm+strom",
    src: "music/12.mp3",
  },
  {
    title: "30 more",
    src: "music/13.mp3",
  },
  {
    title: "bat caves",
    src: "music/14.mp3",
  },
  {
    title: "obsessed",
    src: "music/15.mp3",
  },
  {
    title: "survival of the sickest",
    src: "music/16.mp3",
  },
  {
    title: "THE ETERNAL CYCLE OF LIFE",
    src: "music/17.mp3",
  },
];

// Desktop Controls
const lastSongBtn = document.querySelector(".last-song-btn");
const playPauseBtn = document.querySelector(".play-pause-btn");
const nextSongBtn = document.querySelector(".next-song-btn");
const currentSongTitle = document.querySelector(".current-song-title");
const marquee = document.querySelector('.marquee');
const timePlaceholder = document.querySelector('.timeplaceholder');

// Mobile Controls
const mobileLastSongBtn = document.querySelector(".mobile-controls .last-song-btn");
const mobilePlayPauseBtn = document.querySelector(".mobile-controls .play-pause-btn");
const mobileNextSongBtn = document.querySelector(".mobile-controls .next-song-btn");
const mobileCurrentSongTitle = document.querySelector(".mobile-player-title");
const mobileTimePlaceholder = document.querySelector(".mobile-info .timeplaceholder");

// Marquee-Effekt für lange Titel
function applyMarqueeEffect() {
  if (currentSongTitle && currentSongTitle.textContent.length >= 25) {
    marquee.classList.add('active');
  } else if (marquee) {
    marquee.classList.remove('active');
  }
}

// Song abspielen
function playSong(newSong = false) {
  if (newSong) {
    pausedTime = 0; // Nur zurücksetzen, wenn wirklich ein neuer Song startet
  }
  musicPlayer.src = songs[currentSongIndex].src;
  musicPlayer.currentTime = pausedTime; // Verwende pausedTime, um den Song an der richtigen Stelle abzuspielen
  musicPlayer.play();
  isPlaying = true;
  
  // Update desktop play/pause button
  if (playPauseBtn) {
    playPauseBtn.innerHTML = "<i class='ion-ios-pause'></i>";
  }
  
  // Update mobile play/pause button
  if (mobilePlayPauseBtn) {
    mobilePlayPauseBtn.innerHTML = "<i class='ion-ios-pause'></i>";
  }
  
  // Update song titles
  if (currentSongTitle) {
    currentSongTitle.textContent = songs[currentSongIndex].title;
  }
  
  applyMarqueeEffect();
  updatePlaylist();
}

// Song pausieren
function pauseSong() {
  pausedTime = musicPlayer.currentTime; // Aktualisiere pausedTime, wenn der Song pausiert wird
  musicPlayer.pause();
  isPlaying = false;
  
  // Update desktop play/pause button
  if (playPauseBtn) {
    playPauseBtn.innerHTML = "<i class='ion-ios-play'></i>";
  }
  
  // Update mobile play/pause button
  if (mobilePlayPauseBtn) {
    mobilePlayPauseBtn.innerHTML = "<i class='ion-ios-play'></i>";
  }
}

// Play/Pause-Toggle
function togglePlayPause() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

// Nächsten Song abspielen
function playNextSong() {
  pausedTime = 0;
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0; // Neustart der Playlist
  }
  playSong(true);
}

function playLastSong() {
  pausedTime = 0;
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  playSong(true);
}

// Fortschrittsbalken aktualisieren
const progressBar = document.querySelector(".progress-bar");
const progressToggle = document.querySelector(".progress-toggle");
const bufferedBar = document.querySelector('.buffered-bar');

function updateProgressBar() {
  if (!musicPlayer.duration) return;

  const progressPercent = (musicPlayer.currentTime / musicPlayer.duration) * 100;
  
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }
  
  if (progressToggle) {
    progressToggle.style.left = `${progressPercent}%`;
  }

  if (musicPlayer.buffered.length > 0 && bufferedBar) {
    const bufferedPercent = (musicPlayer.buffered.end(0) / musicPlayer.duration) * 100;
    bufferedBar.style.width = `${bufferedPercent}%`;
  }

  // Zeit-Anzeige für Desktop und Mobile
  const currentMinutes = Math.floor(musicPlayer.currentTime / 60);
  const currentSeconds = Math.floor(musicPlayer.currentTime % 60);
  const durationMinutes = Math.floor(musicPlayer.duration / 60);
  const durationSeconds = Math.floor(musicPlayer.duration % 60);

  const formatTime = (min, sec) => `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  
  if (timePlaceholder) {
    timePlaceholder.textContent = `${formatTime(currentMinutes, currentSeconds)} | ${formatTime(durationMinutes, durationSeconds)}`;
  }
  
  if (mobileTimePlaceholder) {
    mobileTimePlaceholder.textContent = `${formatTime(currentMinutes, currentSeconds)} | ${formatTime(durationMinutes, durationSeconds)}`;
  }
}

const progressBarContainer = document.querySelector(".progress-bar-container");

function setProgress(e) {
  if (!musicPlayer.duration) return;

  const rect = progressBarContainer.getBoundingClientRect();
  const clickPosition = e.clientX - rect.left;
  const containerWidth = rect.width;
  const percentage = (clickPosition / containerWidth);

  const newTime = Math.max(0, Math.min(1, percentage)) * musicPlayer.duration;

  musicPlayer.currentTime = newTime;
  pausedTime = newTime; // Aktualisiere pausedTime, wenn der Fortschrittsbalken geändert wird
}

// Drag and Drop für Fortschrittsleiste
let isDraggingProgress = false;

progressBarContainer.addEventListener('mousedown', (e) => {
  isDraggingProgress = true;
  setProgress(e);
});

document.addEventListener('mousemove', (e) => {
  if (isDraggingProgress) {
    setProgress(e);
  }
});

document.addEventListener('mouseup', () => {
  isDraggingProgress = false;
});

progressBarContainer.addEventListener('click', setProgress);

// Automatischen Wechsel zum nächsten Song aktivieren
musicPlayer.addEventListener("ended", playNextSong);

// Lautstärkeregler für Desktop
const volumeBar = document.querySelector(".volume-bar");
const volumeToggle = document.querySelector(".volume-toggle");
const volumeBarContainer = document.querySelector(".volume-bar-container");

let isDraggingVolume = false;

// Funktion zum Aktualisieren der Lautstärke
function setVolume(e) {
  const rect = volumeBarContainer.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(1, percent)); // Begrenzen auf 0 - 1
  musicPlayer.volume = percent;
  volumeBar.style.width = `${percent * 100}%`;
  volumeToggle.style.left = `${percent * 100}%`;
}

// Event-Listener für das Ziehen des Reglers
volumeToggle.addEventListener("mousedown", () => {
  isDraggingVolume = true;
});

document.addEventListener("mousemove", (e) => {
  if (isDraggingVolume) {
    setVolume(e);
  }
});

document.addEventListener("mouseup", () => {
  isDraggingVolume = false;
});

// Event-Listener für das Klicken auf die Lautstärkeleiste
volumeBarContainer.addEventListener("click", setVolume);

// Initiale Lautstärke setzen (50%)
musicPlayer.volume = 0.5;
volumeBar.style.width = "50%";
volumeToggle.style.left = "50%";

// Lautstärkeregler für Mobile
const mobileVolumeBar = document.querySelector(".mobile-volume .volume-bar");
const mobileVolumeToggle = document.querySelector(".mobile-volume .volume-toggle");
const mobileVolumeBarContainer = document.querySelector(".mobile-volume .volume-bar-container");

let isDraggingMobileVolume = false;

// Funktion zum Aktualisieren der mobilen Lautstärke
function setMobileVolume(e) {
  const rect = mobileVolumeBarContainer.getBoundingClientRect();
  // Get the X position from either mouse or touch event
  const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : e.changedTouches[0].clientX);
  let percent = (clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(1, percent)); // Begrenzen auf 0 - 1
  musicPlayer.volume = percent;
  mobileVolumeBar.style.width = `${percent * 100}%`;
  mobileVolumeToggle.style.left = `${percent * 100}%`;
}

// Event-Listener für das Ziehen des mobilen Reglers
mobileVolumeToggle.addEventListener("mousedown", () => {
  isDraggingMobileVolume = true;
});

document.addEventListener("mousemove", (e) => {
  if (isDraggingMobileVolume) {
    setMobileVolume(e);
  }
});

document.addEventListener("mouseup", () => {
  isDraggingMobileVolume = false;
});

// Event-Listener für das Ziehen des mobilen Reglers - Touch Events
mobileVolumeToggle.addEventListener("touchstart", (e) => {
  isDraggingMobileVolume = true;
  e.preventDefault(); // Prevent scrolling when touching the toggle
});

document.addEventListener("touchmove", (e) => {
  if (isDraggingMobileVolume) {
    setMobileVolume(e);
    e.preventDefault(); // Prevent scrolling while dragging
  }
});

document.addEventListener("touchend", () => {
  isDraggingMobileVolume = false;
});

// Event-Listener für das Klicken auf die mobile Lautstärkeleiste
mobileVolumeBarContainer.addEventListener("click", setMobileVolume);
mobileVolumeBarContainer.addEventListener("touchend", (e) => {
  // Only trigger if it wasn't a drag operation
  if (!isDraggingMobileVolume) {
    setMobileVolume(e);
  }
});

// Initiale Lautstärke setzen (50%)
mobileVolumeBar.style.width = "50%";
mobileVolumeToggle.style.left = "50%";

// Sidebar für Mobile
const mobileHamburgerBtn = document.querySelector(".mobile-volume .hamburger-btn");

mobileHamburgerBtn.addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.right = sidebar.style.right === "0px" ? "-250px" : "0px";
});

// Desktop Event-Listener
if (playPauseBtn) {
  playPauseBtn.addEventListener("click", togglePlayPause);
}

if (lastSongBtn) {
  lastSongBtn.addEventListener("click", playLastSong);
}

if (nextSongBtn) {
  nextSongBtn.addEventListener("click", playNextSong);
}

// Mobile Event-Listener
if (mobilePlayPauseBtn) {
  mobilePlayPauseBtn.addEventListener("click", togglePlayPause);
}

if (mobileLastSongBtn) {
  mobileLastSongBtn.addEventListener("click", playLastSong);
}

if (mobileNextSongBtn) {
  mobileNextSongBtn.addEventListener("click", playNextSong);
}

musicPlayer.addEventListener("timeupdate", updateProgressBar);

// Platzhalter-Texte setzen
const owoPlaceholder = document.querySelector('.owoplaceholder');
if (owoPlaceholder) {
  owoPlaceholder.textContent = 'OWO Music Player';
}

// Initial playlist generation
updatePlaylist();

// Start first song
// playSong();
