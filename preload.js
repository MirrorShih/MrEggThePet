const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

    const img = document.getElementById('img');
    const switchMrEgg = number => img.src = `imgs/mregg_${number}.gif`;

    ipcRenderer.on('switch-mregg', (event, args) => switchMrEgg(args));
});
