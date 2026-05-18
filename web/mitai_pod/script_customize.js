const soundsDir = '../../assets/sounds/ui/mitakit/customize/';
const notifDir = '../../assets/sounds/ui/notification/';
const uiDir = '../../assets/sounds/ui/mitai_pod/';
const VERSION_KEY = "MITAI_V0.2.0";

const audioCache = {
    step01: new Audio(soundsDir + 'change_module_01.wav'),
    step02: new Audio(soundsDir + 'change_module_02.wav'),
    step03: new Audio(soundsDir + 'change_module_03.wav'),
    notifAccept: new Audio(notifDir + 'notification_accept_01.wav'),
    notifCancel: new Audio(notifDir + 'notification_decline_01.wav'),
    notifReceived: new Audio(notifDir + 'notification_received_01.wav'),
    clickAccept: new Audio(uiDir + 'accept_01.wav'),
    clickCancel: new Audio(uiDir + 'cancel_01.wav')
};

Object.values(audioCache).forEach(audio => {
    audio.preload = 'auto';
    audio.load();
});

let selectedCharacter = 'hatsune_miku';

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

function handleStartupLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const decrypted = decryptSave(e.target.result);
            const saveData = JSON.parse(decrypted);
            if (saveData.project_mitai) {
                audioCache.notifAccept.currentTime = 0;
                audioCache.notifAccept.play().catch(() => {});
                
                document.getElementById('startup-lock').style.display = 'none';
                if (saveData.character) {
                    selectedCharacter = saveData.character;
                    
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            const img = document.getElementById('preview-img');
                            const name = document.getElementById('char-name-display');
                            if (img) img.src = `../../assets/textures/ui/customize/characters/${selectedCharacter}.png?v=${Date.now()}`;
                            if (name) name.innerText = selectedCharacter.replace('_', ' ').toUpperCase();
                        });
                    }, 200);
                }
            } else {
                throw new Error();
            }
        } catch (err) { 
            audioCache.notifCancel.currentTime = 0;
            audioCache.notifCancel.play().catch(() => {});
            alert("DECRYPTION ERROR: File corrupted."); 
        }
    };
    reader.readAsText(file);
}

function changeCharacter(char) {
    selectedCharacter = char;
    const nameDisplay = document.getElementById('char-name-display');
    if (nameDisplay) nameDisplay.innerText = char.replace('_', ' ').toUpperCase();

    audioCache.step01.pause(); audioCache.step01.currentTime = 0;
    audioCache.step02.pause(); audioCache.step02.currentTime = 0;
    audioCache.step03.pause(); audioCache.step03.currentTime = 0;

    audioCache.step01.play().catch(() => {});
    setTimeout(() => {
        audioCache.step02.play().catch(() => {});
        const randomDuration = Math.floor(Math.random() * 1001) + 1000; 
        
        setTimeout(() => {
            audioCache.step02.pause();
            const img = document.getElementById('preview-img');
            if (img) {
                requestAnimationFrame(() => {
                    img.src = `../../assets/textures/ui/customize/characters/${char}.png?v=${Date.now()}`;
                });
            }
            audioCache.step03.play().catch(() => {});
        }, randomDuration);
    }, 500);
}

function exitToPod(event) { 
    if (event) {
        event.preventDefault();
    }
    audioCache.notifCancel.currentTime = 0;
    audioCache.notifCancel.play().catch(() => {});
    setTimeout(() => { window.location.href = 'mitai_pod.html'; }, 700); 
}

function handleMainCancel(event) { 
    if (event) {
        event.preventDefault();
    }
    audioCache.clickCancel.currentTime = 0;
    audioCache.clickCancel.play().catch(() => {});
    setTimeout(() => { window.location.href = 'mitai_pod.html'; }, 700); 
}

function showSaveConfirmation() {
    audioCache.clickAccept.currentTime = 0;
    audioCache.clickAccept.play().catch(() => {});
    
    setTimeout(() => {
        audioCache.notifReceived.currentTime = 0;
        audioCache.notifReceived.play().catch(() => {});
        document.getElementById('save-modal').style.display = 'flex';
    }, 150);
}

function closeSaveModal() { 
    audioCache.notifCancel.currentTime = 0;
    audioCache.notifCancel.play().catch(() => {});
    document.getElementById('save-modal').style.display = 'none'; 
}

function executeSaveAndExit() {
    audioCache.notifAccept.currentTime = 0;
    audioCache.notifAccept.play().catch(() => {});

    const saveData = { 
        project_mitai: true, 
        character: selectedCharacter, 
        version: VERSION_KEY,
        timestamp: Date.now()
    };
    const encrypted = encryptSave(saveData);
    const blob = new Blob([encrypted], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progress.mitai_save';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => { window.location.href = 'mitai_pod.html'; }, 1000);
}

document.addEventListener('click', (e) => {
    const effect = document.createElement('div');
    effect.className = 'click-effect-classic';
    effect.style.left = e.pageX + 'px';
    effect.style.top = e.pageY + 'px';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
});

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('startup-lock').style.display !== 'none') {
            audioCache.notifReceived.currentTime = 0;
            audioCache.notifReceived.play().catch(() => {});
        }
    }, 500);
});
