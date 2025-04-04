// OWO Music Player v0.339
// brought to you by

//                                    o8o           oooo                        .o8
//oooo    ooo  .oooo.   ooo. .oo.   oooo   .oooo.o  888 .oo.    .ooooo.   .oooo888
//`88.  .8'  `P  )88b  `888P"Y88b  `888  d88(  "8  888P"Y88b  d88' `88b d88' `888
//`88..8'    .oP"888   888   888   888  `"Y88b.   888   888  888ooo888 888   888
//`888'    d8(  888   888   888   888  o.  )88b  888   888  888    .o 888   888
//`8'     `Y888""8o o888o o888o o888o 8""888P' o888o o888o `Y8bod8P' `Y8bod88P"

document.addEventListener('DOMContentLoaded', () => {

    // --- Global Variables & Constants ---
    const musicPlayer = document.getElementById("music-player");
    const songs = [
        // Songliste
        { title: "mirage tower", src: "music/1.mp3", },
        { title: "how to disappear¿?¿", src: "music/2.mp3", },
        { title: "untitled", src: "music/3.mp3", },
        { title: "avoid thinking", src: "music/4.mp3", },
        { title: "r u ok? <3", src: "music/5.mp3", },
        { title: ":3 ^-^ >.< :P xD o.O uwu", src: "music/6.mp3", },
        { title: "waaaaaaaaaa", src: "music/7.mp3", },
        { title: "I really want to see you again （*＾-＾*）", src: "music/8.mp3", },
        { title: "ten ｡･:*:･ﾟ★｡･:*:･ﾟ☆", src: "music/9.mp3", },
        { title: "cursed bunny awful mix", src: "music/10.mp3", },
        { title: "obsessed pt II", src: "music/11.mp3", },
        { title: "storm+strom", src: "music/12.mp3", },
        { title: "30 more", src: "music/13.mp3", },
        { title: "bat caves", src: "music/14.mp3", },
        { title: "obsessed", src: "music/15.mp3", },
        { title: "survival of the sickest", src: "music/16.mp3", },
        { title: "THE ETERNAL CYCLE OF LIFE", src: "music/17.mp3", },
    ];
    let currentSongIndex = 0;
    let isPlaying = false;
    let pausedTime = 0;
    let isDraggingProgress = false;
    let isDraggingVolume = false;
    let activeVolumeContainer = null; // Für Lautstärke-Drag relevant
    let initialPlaybackHasStarted = false; // Flag für erste Wiedergabe (Desktop/Mobile Zeit)

    // --- DOM Element References ---
    const playPauseBtns = document.querySelectorAll(".play-pause-btn");
    const lastSongBtns = document.querySelectorAll(".last-song-btn");
    const nextSongBtns = document.querySelectorAll(".next-song-btn");
    const hamburgerBtns = document.querySelectorAll(".hamburger-btn");

    const desktopPlayerElement = document.querySelector(".desktop-player"); // Referenz für Desktop-Player Zeit-Anzeige
    const mobilePlayerElement = document.querySelector(".mobile-music-player"); // Referenz für Mobile-Player Zeit-Anzeige
    const desktopTitle = document.querySelector(".desktop-player .current-song-title");
    const mobileTitle = document.querySelector(".mobile-player-title");
    const marqueeContainer = document.querySelector('.desktop-player .marquee');
    const mobileMarqueeContainer = document.querySelector('.mobile-info .mobile-marquee');
    const timePlaceholders = document.querySelectorAll('.timeplaceholder'); // Holt beide (Desktop+Mobile)

    const progressBarContainer = document.querySelector(".progress-bar-container");
    const progressBar = progressBarContainer?.querySelector(".progress-bar");
    const progressToggle = progressBarContainer?.querySelector(".progress-toggle");
    const bufferedBar = progressBarContainer?.querySelector('.buffered-bar');

    const volumeContainers = document.querySelectorAll('.volume-bar-container');
    const sidebar = document.querySelector(".sidebar");
    const playlistEl = document.querySelector(".playlist");
    const owoPlaceholder = document.querySelector('.owoplaceholder');

    // --- UI Update Functions ---
    function updatePlayPauseUI(playing) {
        const iconClass = playing ? 'ion-ios-pause' : 'ion-ios-play';
        playPauseBtns.forEach(btn => {
            btn.innerHTML = `<i class='${iconClass}'></i>`;
        });
    }
    function updateSongTitleUI(title) {
        if (desktopTitle) desktopTitle.textContent = title;
        if (mobileTitle) mobileTitle.textContent = title; // Überschreibt initiales "OWO Music Player"

        // Marquee Logik
        if (marqueeContainer && desktopTitle) {
            marqueeContainer.classList.toggle('active', desktopTitle.textContent.length >= 25);
        }
        if (mobileMarqueeContainer && mobileTitle) {
             mobileMarqueeContainer.classList.toggle('active', mobileTitle.textContent.length >= 15);
        }
    }
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    function updateTimeUI(currentTime, duration) {
        const currentTimeFormatted = formatTime(currentTime);
        const durationFormatted = formatTime(duration || 0);
        const text = `${currentTimeFormatted} | ${durationFormatted}`;
        // Update alle Zeit-Platzhalter (auch die anfangs unsichtbaren)
        timePlaceholders.forEach(el => {
            el.textContent = text;
        });
    }
    function updateProgressBarUI(percent, bufferedPercent) {
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressToggle) progressToggle.style.left = `${percent}%`;
        if (bufferedBar) bufferedBar.style.width = `${bufferedPercent}%`;
    }
    function updateVolumeUI(volume) {
        const percent = volume * 100;
        volumeContainers.forEach(container => {
            const bar = container.querySelector('.volume-bar');
            const toggle = container.querySelector('.volume-toggle');
            if (bar) bar.style.width = `${percent}%`;
            if (toggle) toggle.style.left = `${percent}%`;
        });
    }

    // --- Core Playback Functions ---
    function playSong(newSong = false) {
        if (!songs.length) return;
        if (newSong) pausedTime = 0;

        const song = songs[currentSongIndex];

        if (!musicPlayer.src || musicPlayer.src.split('/').pop() !== song.src.split('/').pop()) {
            musicPlayer.src = song.src;
        }

        musicPlayer.currentTime = pausedTime;

        musicPlayer.play().then(() => {
             isPlaying = true;
             updatePlayPauseUI(true);
             updateSongTitleUI(song.title);
             updatePlaylistActiveItem();

             // Klasse für Zeit-Anzeige hinzufügen, nur beim allerersten Start
             if (!initialPlaybackHasStarted) {
                 // Für Desktop
                 if (desktopPlayerElement) {
                     desktopPlayerElement.classList.add('playback-started');
                 }
                 // Für Mobile
                 if (mobilePlayerElement) {
                     mobilePlayerElement.classList.add('playback-started');
                 }
                 initialPlaybackHasStarted = true;
             }
             // --- ENDE Anpassung für Zeit-Anzeige ---

        }).catch(error => {
             console.error("Playback Error:", error);
             isPlaying = false;
             updatePlayPauseUI(false);
        });
    }
    function pauseSong() {
        if (!isPlaying) return;
        pausedTime = musicPlayer.currentTime;
        musicPlayer.pause();
        isPlaying = false;
        updatePlayPauseUI(false);
    }
    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong(musicPlayer.readyState === 0 || musicPlayer.currentSrc === "");
        }
    }
    function playNextSong() {
        if (!songs.length) return;
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(true);
    }
    function playLastSong() {
        if (!songs.length) return;
        if (musicPlayer.currentTime > 3 && isPlaying) {
             musicPlayer.currentTime = 0;
             pausedTime = 0;
             playSong();
        } else {
             currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
             playSong(true);
        }
    }

    // --- Progress Bar Handling ---
    function handleProgressUpdate() {
         if (!musicPlayer.duration || isDraggingProgress) return;

         const progressPercent = (musicPlayer.currentTime / musicPlayer.duration) * 100;
         let bufferedPercent = 0;

         if (musicPlayer.buffered.length > 0) {
              for (let i = 0; i < musicPlayer.buffered.length; i++) {
                 if (musicPlayer.buffered.start(i) <= musicPlayer.currentTime && musicPlayer.buffered.end(i) >= musicPlayer.currentTime) {
                     bufferedPercent = (musicPlayer.buffered.end(i) / musicPlayer.duration) * 100;
                     break;
                 }
              }
              if (bufferedPercent === 0 && musicPlayer.buffered.length > 0) {
                  bufferedPercent = (musicPlayer.buffered.end(musicPlayer.buffered.length - 1) / musicPlayer.duration) * 100;
              }
         }

         updateProgressBarUI(progressPercent, bufferedPercent);
         updateTimeUI(musicPlayer.currentTime, musicPlayer.duration);
    }
    function setProgress(e) {
        if (!musicPlayer.duration || !progressBarContainer) return;

        const rect = progressBarContainer.getBoundingClientRect();
        const clickX = e.clientX ?? e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? null;
        if (clickX === null) return;

        const clickPosition = clickX - rect.left;
        const containerWidth = rect.width;
        const percentage = Math.max(0, Math.min(1, clickPosition / containerWidth));

        const newTime = percentage * musicPlayer.duration;
        musicPlayer.currentTime = newTime;
        pausedTime = newTime;
        handleProgressUpdate();
    }

    // --- Volume Control Handling ---
    const handleVolumeDragMove = (e) => {
        if (isDraggingVolume && activeVolumeContainer) {
            setVolume(e, activeVolumeContainer);
            e.preventDefault();
        }
    };
    const handleVolumeDragEnd = () => {
        if (isDraggingVolume) {
            isDraggingVolume = false;
            activeVolumeContainer = null;
            document.body.style.userSelect = '';
        }
    };

    function setVolume(e, container) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        let clientX = null;

        if (e.type.startsWith('touch')) {
            clientX = e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? null;
        } else {
            clientX = e.clientX;
        }

        if (clientX === null) {
             return;
        }

        let percent = (clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));

        musicPlayer.volume = percent;
        updateVolumeUI(percent);
    }

    volumeContainers.forEach(container => {
        const toggle = container.querySelector('.volume-toggle');

        const startVolumeDrag = (e) => {
            isDraggingVolume = true;
            activeVolumeContainer = container;
            setVolume(e, activeVolumeContainer);
            document.body.style.userSelect = 'none';
        };

        container.addEventListener('mousedown', startVolumeDrag);
        container.addEventListener('touchstart', (e) => {
             if (e.target === container || e.target === toggle || container.contains(e.target)) {
                 startVolumeDrag(e);
             }
        }, { passive: true });
        container.addEventListener('click', (e) => {
             if (!isDraggingVolume && e.target !== toggle && activeVolumeContainer === null) {
                 setVolume(e, container);
             }
        });
    });

    document.addEventListener('mousemove', handleVolumeDragMove);
    document.addEventListener('mouseup', handleVolumeDragEnd);
    document.addEventListener('touchmove', (e) => {
        if (isDraggingVolume && activeVolumeContainer) {
             handleVolumeDragMove(e);
        }
    }, { passive: false });
    document.addEventListener('touchend', handleVolumeDragEnd);

    // --- Playlist Handling ---
    function updatePlaylistActiveItem() {
        const items = playlistEl?.querySelectorAll("li");
        items?.forEach((li, index) => {
            li.classList.toggle("active", index === currentSongIndex);
        });
    }
    function generatePlaylist() {
        if (!playlistEl) return;
        playlistEl.innerHTML = "";
        songs.forEach((song, index) => {
            const li = document.createElement("li");
            li.textContent = song.title;
            li.dataset.index = index;
            li.addEventListener("click", () => {
                const clickedIndex = parseInt(li.dataset.index, 10);
                if (clickedIndex !== currentSongIndex || !isPlaying) {
                     currentSongIndex = clickedIndex;
                     playSong(true);
                }
            });
            playlistEl.appendChild(li);
        });
        updatePlaylistActiveItem();
    }

    // --- Sidebar Toggle ---
    function toggleSidebar() {
        if (!sidebar) return;
        const computedStyle = window.getComputedStyle(sidebar);
        const currentRight = computedStyle.right;
        sidebar.style.right = (currentRight === "0px") ? "-250px" : "0px";
    }

    // --- Progress Bar Event Listeners Setup ---
     if (progressBarContainer) {
        const startProgressDrag = (e) => {
             if (!musicPlayer.duration) return;
             isDraggingProgress = true;
             setProgress(e);
             document.body.style.userSelect = 'none';
        };
        const dragProgress = (e) => {
            if (isDraggingProgress) {
                 setProgress(e);
                 e.preventDefault();
            }
        };
        const endProgressDrag = () => {
            if(isDraggingProgress) {
                 isDraggingProgress = false;
                 document.body.style.userSelect = '';
            }
        };

        progressBarContainer.addEventListener('mousedown', startProgressDrag);
        progressBarContainer.addEventListener('touchstart', startProgressDrag, { passive: true });
        progressBarContainer.addEventListener('click', (e) => {
             if (!isDraggingProgress && e.target !== progressToggle) {
                 setProgress(e);
             }
        });
        document.addEventListener('mousemove', dragProgress);
        document.addEventListener('mouseup', endProgressDrag);
        document.addEventListener('touchmove', (e) => {
             if(isDraggingProgress) {
                 dragProgress(e);
             }
        }, { passive: false });
        document.addEventListener('touchend', endProgressDrag);
    }

    // --- Event Listeners (Play, Nav, Hamburger) ---
    playPauseBtns.forEach(btn => btn.addEventListener("click", togglePlayPause));
    lastSongBtns.forEach(btn => btn.addEventListener("click", playLastSong));
    nextSongBtns.forEach(btn => btn.addEventListener("click", playNextSong));
    hamburgerBtns.forEach(btn => btn.addEventListener("click", toggleSidebar));

    // --- Audio Player Events ---
    musicPlayer.addEventListener("timeupdate", handleProgressUpdate);
    musicPlayer.addEventListener("ended", playNextSong);
    musicPlayer.addEventListener("loadedmetadata", handleProgressUpdate);
    musicPlayer.addEventListener("loadstart", () => {
         updateProgressBarUI(0, 0);
         // updateTimeUI(0, 0);
    });
    musicPlayer.addEventListener("error", (e) => {
        console.error("Audio Player Error:", e);
        isPlaying = false;
        updatePlayPauseUI(false);
        updateSongTitleUI("Error loading song");
    });

    // --- Initialization ---
    if (owoPlaceholder) { owoPlaceholder.textContent = 'OWO Music Player'; }
    musicPlayer.volume = 0.5;
    updateVolumeUI(musicPlayer.volume);
    updateTimeUI(0, 0); // Setzt Zeit initial auf 00:00 | 00:00 (wird durch CSS versteckt)
    generatePlaylist();

    if (songs.length > 0) {
        // updateSongTitleUI(songs[0].title); // Titel wird nicht sofort angezeigt

        // --- Code zum Vorladen des ersten Songs ---
        if (!musicPlayer.currentSrc) {
            musicPlayer.src = songs[0].src;
        }
        // --- Ende Code zum Vorladen ---

    } else {
        // Meldung für keine Songs
        updateSongTitleUI("No songs loaded");
        if(mobileTitle) mobileTitle.textContent = "No songs loaded"; // Auch für Mobile
    }
    updatePlayPauseUI(false); // Setzt initialen UI-Status auf Pause

}); // Ende von DOMContentLoaded Listener
