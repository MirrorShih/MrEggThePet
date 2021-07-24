const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

    const img = document.getElementById('img');
    const switchMrEgg = egg => img.src = `imgs/${egg}.gif`;

    ipcRenderer.on('switch-mregg', (event, args) => switchMrEgg(args));
});
