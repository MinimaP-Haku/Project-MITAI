const notify = document.getElementById('sndNotify');
const notifAccept = document.getElementById('sndNotifAccept');
const notifDecline = document.getElementById('sndNotifDecline');
const click = document.getElementById('sndClick');

const modalSave = document.getElementById('modal-save');
const modalUI = document.getElementById('modal-ui');
const modalWarn = document.getElementById('modal-customize-warn');

let currentCharacter = "hatsune_miku";
const VERSION_KEY = "MITAI_V0.2.0"; 

function playSfx(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

function decryptSave(encryptedData) {
    let decrypted = "";
    for (let i = 0; i < encryptedData.length; i++) {
        let charCode = encryptedData.charCodeAt(i) - 10;
        let keyChar = VERSION_KEY.charCodeAt(i % VERSION_KEY.length);
        decrypted += String.fromCharCode(charCode ^ keyChar);
    }
    return decrypted;
}

function encryptSave(content) {
    let encrypted = "";
    const strContent = JSON.stringify(content);
    for (let i = 0; i < strContent.length; i++) {
        let keyChar = VERSION_KEY.charCodeAt(i % VERSION_KEY.length);
        let charCode = strContent.charCodeAt(i) ^ keyChar;
        encrypted += String.fromCharCode(charCode + 10);
    }
    return encrypted;
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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const rawContent = e.target.result;
            const decryptedContent = decryptSave(rawContent);
            const saveData = JSON.parse(decryptedContent);

            if (saveData.project_mitai) {
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
            }
        } catch (err) {
            playSfx(notifDecline);
            alert("FILE ERROR");
        }
    };
    reader.readAsText(file);
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
    const saveData = {
        project_mitai: true,
        character: currentCharacter,
        version: VERSION_KEY,
        timestamp: Date.now()
    };
    const encrypted = encryptSave(saveData);
    const blob = new Blob([encrypted], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_progress.mitai_save';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    setTimeout(() => playSfx(notify), 300);
};
