const path = require("path")
const { app, BrowserWindow, Menu } = require("electron")

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"

const menu = [
  {
    role: "fileMenu",
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
]

//Create the main window
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  })

  //Open devtools if in dev env

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"))
}

//Create the about window

function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About Image Resizer",
    width: 300,
    height: 300,
  })

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"))
}

app.whenReady().then(() => {
  createMainWindow()

  //implement menu

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on("window-all-closed", () => {
  if (!isMac) app.quit()
})
