const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

var tray = null

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
    return mainWindow;
}


function createTray(win) {

    const switchMrEgg = (eggNo) => () => {
        win.show();
        win.webContents.send('switch-mregg', eggNo);
    }
    const iconPath = path.join(__dirname, './imgs/tray.png');
    tray = Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Egg 0', click: switchMrEgg(1) },
        { label: 'Egg Walk', click: switchMrEgg(2) },
        {
            label: 'Hide',
            click: () => win.hide()
        },
        {
            label: 'Close',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ])
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
