const progressFill = document.getElementById('progress-fill');
const detailsText = document.getElementById('loading-details');
const statusText = document.getElementById('status-text');
const notice = document.getElementById('notice-finished');
const music = document.getElementById('loadingMusic');
const notify = document.getElementById('sndNotify');
const notifAccept = document.getElementById('sndNotifAccept');

const loadingSteps = [
    "Decrypting neural links...",
    "Connecting to 三田井 servers...",
    "Loading textures and assets...",
    "Compiling shader cache...",
    "Finalizing environment...",
    "Loading successful!"
];

let progress = 0;
let stepIndex = 0;

function playSfx(audioElement) {
    if (audioElement) {
        if (music) music.volume = 0.15;
        audioElement.currentTime = 0;
        audioElement.volume = 1.0;
        audioElement.play().catch(() => {});
        
        setTimeout(() => {
            if (music && notice.style.display === 'flex') music.volume = 0.3;
        }, 1000);
    }
}

function handleReturn() {
    playSfx(notifAccept);
    setTimeout(() => {
        window.location.href = '../mitai_pod/mitai_pod.html';
    }, 400);
}

function simulateLoading() {
    if (progress === 0 && music) {
        music.volume = 0.5;
        music.play().catch(() => {});
    }

    progress += Math.random() * 5;
    if (progress > 100) progress = 100;
    
    progressFill.style.width = progress + "%";
    
    if (progress > (stepIndex + 1) * (100 / loadingSteps.length)) {
        if (stepIndex < loadingSteps.length - 1) {
            detailsText.innerText = loadingSteps[stepIndex];
            stepIndex++;
        }
    }
    
    if (progress < 100) {
        setTimeout(simulateLoading, 100);
    } else {
        statusText.innerText = "LOADING COMPLETE";
        setTimeout(() => {
            document.getElementById('loading-container').style.display = 'none';
            notice.style.display = 'flex';
            playSfx(notify);
        }, 1000);
    }
}

window.onload = simulateLoading;

document.addEventListener('click', (e) => {
    const effect = document.createElement('div');
    effect.className = 'click-effect-classic';
    
    effect.style.left = e.pageX + 'px';
    effect.style.top = e.pageY + 'px';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 500);
});
