function setRandomFavicon() {
    const characters = ['hatsune_miku', 'kasane_teto'];
    const chosenChar = characters[Math.floor(Math.random() * characters.length)];
    const sizes = [16, 32, 64, 128, 256, 512];
    
    const oldIcons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
    oldIcons.forEach(icon => icon.remove());

    sizes.forEach(size => {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.sizes = `${size}x${size}`;
        link.href = `../../assets/textures/ui/icons/${chosenChar}_${size}.png`;
        document.getElementsByTagName('head')[0].appendChild(link);
    });

    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = `../../assets/textures/ui/icons/${chosenChar}_512.png`;
    document.getElementsByTagName('head')[0].appendChild(appleIcon);
}

setRandomFavicon();
