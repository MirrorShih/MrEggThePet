const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const fs=require('fs/promises');

let tray = null;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 140,
        height: 145,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
        transparent: true,
        autoHideMenuBar: true
    });

    mainWindow.loadFile('index.html');
    mainWindow.setAlwaysOnTop(true, 'floating')
    mainWindow.setSkipTaskbar(true)
    mainWindow.setResizable(false)
    return mainWindow;
}


async function createTray(win) {

    const switchMrEgg = (egg) => () => {
        win.show();
        win.webContents.send('switch-mregg', egg);
    }
    const iconPath = path.join(__dirname, './imgs/tray.png');
    tray = Tray(iconPath);
    let trayMenu = [];

    const files=await fs.readdir('./imgs/')
    files.forEach(file => {
        if(file !== "tray.png") {
            trayMenu.push({label: file.split('.')[0], click: switchMrEgg(file.split('.')[0])})
        }
    })
    trayMenu.push({label: 'Hide', click: () => win.hide()});
    trayMenu.push({label: 'Exit', click: () => app.quit()});
    const contextMenu = Menu.buildFromTemplate(trayMenu);
    tray.setToolTip("MrEggThePet")
    tray.setContextMenu(contextMenu);
    tray.on('click', () => win.show())
    return tray;
}

app.on('ready', () => {
    const win = createWindow();
    createTray(win);
})

app.on('window-all-closed', () => app.quit())
