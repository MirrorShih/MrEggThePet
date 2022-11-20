const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const fs=require('fs/promises');
const {autoUpdater}=require('electron-updater');
let autoLaunch=require('auto-launch')

let tray = null;
let mainWindow=null;

function createWindow() {
    mainWindow = new BrowserWindow({
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
    if(process.platform!=="darwin") {
        autoUpdater.checkForUpdates();
    }
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
    const files=await fs.readdir(path.join(__dirname,'./imgs/'))
    files.forEach(file => {
        if(file !== "tray.png") {
            trayMenu.push({label: file.substring(0,file.lastIndexOf('.')), click: switchMrEgg(file.substring(0,file.lastIndexOf('.')))})
        }
    })
    let mreggAutoLaunch=new autoLaunch({name:'mreggthepet'})
    trayMenu.push({label:'Auto Launch',type:'checkbox',checked:await mreggAutoLaunch.isEnabled(),click:(menuItem)=>{
        if(menuItem.checked){
            mreggAutoLaunch.enable()
        }
        else{
            mreggAutoLaunch.disable()
        }
        }})
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


autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => app.quit())
