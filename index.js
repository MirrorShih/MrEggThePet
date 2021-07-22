const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 140,
        height: 145,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
        transparent: true,
        autoHideMenuBar: true,
    });

    mainWindow.loadFile('index.html');
    mainWindow.setAlwaysOnTop(true, 'floating')
    return mainWindow;
}

app.on('ready', () => {

    const win = createWindow();

    [1, 2].map(number => {

        globalShortcut.register(`CommandOrControl+${number}`, () => {
            win.webContents.send('switch-mregg', number);
        })
    })
})

app.on('window-all-closed', () => app.quit())
