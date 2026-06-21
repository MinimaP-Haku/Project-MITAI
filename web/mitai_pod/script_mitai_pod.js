const notify = document.getElementById('sndNotify');
const notifAccept = document.getElementById('sndNotifAccept');
const notifDecline = document.getElementById('sndNotifDecline');
const click = document.getElementById('sndClick');
const podMusic = document.getElementById('podMusic');

const modalSave = document.getElementById('modal-save');
const modalUI = document.getElementById('modal-ui');
const modalWarn = document.getElementById('modal-customize-warn');

let currentCharacter = "hatsune_miku";

function playSfx(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

function playPodMusic() {
    if (podMusic) {
        podMusic.volume = 0.3;
        podMusic.play().catch(() => {});
    }
}

function stopPodMusic() {
    if (podMusic) {
        podMusic.pause();
        podMusic.currentTime = 0;
    }
}

function updateCharacterDisplay(char) {
    const charImg = document.getElementById('active-char');
    const charName = document.getElementById('char-name-display');
    
    if (charImg) {
        const time = Date.now();
        const paths = [
            `../../assets/textures/ui/customize/characters/${char}.png?v=${time}`,
            `../assets/textures/ui/customize/characters/${char}.png?v=${time}`,
            `assets/textures/ui/customize/characters/${char}.png?v=${time}`
        ];

        let currentPathIndex = 0;

        const tryLoad = () => {
            if (currentPathIndex < paths.length) {
                requestAnimationFrame(() => {
                    charImg.src = paths[currentPathIndex];
                });
                currentPathIndex++;
            }
        };

        charImg.onerror = function() {
            tryLoad();
        };

        tryLoad();
    }
    
    if (charName) {
        charName.innerText = char.replace('_', ' ').toUpperCase();
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    loadSaveFile(
        file,
        (saveData) => {
            if (saveData.character) {
                currentCharacter = saveData.character;
                
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        updateCharacterDisplay(currentCharacter);
                    });
                }, 200);
            }
            playSfx(notifAccept);
            setTimeout(nextModal, 500);
        },
        (error) => {
            playSfx(notifDecline);
            alert("DECRYPTION ERROR: " + error);
        }
    );
}

function handleCustomizeClick() {
    modalWarn.style.display = 'flex';
    playSfx(click);
    playSfx(notify);
}

function closeCustomizeWarn() {
    playSfx(notifDecline);
    modalWarn.style.display = 'none';
}

function saveAndProceedToCustomize() {
    playSfx(notifAccept);
    const saveData = createSaveData(currentCharacter);
    downloadSaveFile(saveData, 'backup_progress.mitai_save');
    stopPodMusic();
    setTimeout(() => { window.location.href = 'customize.html'; }, 1000);
}

function startNewProject() {
    playSfx(notifDecline);
    setTimeout(nextModal, 500);
}

function nextModal() {
    modalSave.style.display = 'none';
    setTimeout(() => {
        modalUI.style.display = 'flex';
        playSfx(notify);
    }, 500);
}

function closeModals() {
    playSfx(notifAccept);
    modalUI.style.display = 'none';
}

document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-customize') || e.target.closest('.cyber-btn') || e.target.closest('.cyber-btn-secondary')) {
        return;
    }
    const effect = document.createElement('div');
    effect.className = 'click-effect-classic';
    effect.style.left = e.pageX + 'px';
    effect.style.top = e.pageY + 'px';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
});

window.onload = () => {
    setTimeout(() => {
        playSfx(notify);
        playPodMusic();
    }, 300);
};
