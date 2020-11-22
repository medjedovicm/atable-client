const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
} = require("electron");
const path = require("path");
const fs = require("fs")
const url = require("url");
const notifier = require('node-notifier')

const soundPath = path.join(__dirname, './assets/woodblock.mp3');
const iconPath = path.join(__dirname, './assets/icons/atablePng.png');
const iconPathNotification = path.join(__dirname, './assets/icons/atablePngNotification.png');


let win;
// Quick fix -> ako promenljiva nije globalna bude garbage collectovana
let appIcon = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow() {
  appIcon = new Tray(iconPath)
  win = new BrowserWindow({
    width: 1400,
    height: 720,
    minWidth: 1400,
    minHeight: 520,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // win.setMenu(null);
  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `../dist/index.html`),
      protocol: "file:",
      slashes: true
    }),
  );

  let contextMenu = Menu.buildFromTemplate([{
      label: 'Open Atable',
      click: function () {
        appIcon.setImage(iconPath)
        win.show()
      }
    },
    {
      label: 'Quit',
      click: function () {
        app.isQuitting = true
        app.quit()
      }
    },
  ])

  appIcon.setContextMenu(contextMenu)

  win.on('close', function (event) {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
    }

    return false;
  })

  win.on('minimize', function (event) {
    event.preventDefault();
    win.hide();
  })


  ipcMain.handle('notify-read', () => {
    appIcon.setImage(iconPath)
  })

  ipcMain.handle('new-message-notify', async (event, message) => {
    appIcon.setImage(iconPathNotification);
    notifier.notify({
      title: message.username,
      message: message.content,
      icon: iconPath,
      sound: soundPath
    }) 
    notifier.on('click', () => {
      win.show();
      appIcon.setImage(iconPath);
    })
  })
}

app.on("ready", createWindow);

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
