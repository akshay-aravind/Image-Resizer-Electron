const path = require("path")
const os = require("os")
const fs = require("fs")
const resizeImg = require("resize-img")
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron")

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"
let mainWindow
let aboutWindow
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
  mainWindow = new BrowserWindow({
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

  // if (isDev) {
  //   mainWindow.webContents.openDevTools()
  // }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"))
}

//Create the about window

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About Image Resizer",
    width: 300,
    height: 300,
  })

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"))
}

app.on("ready", () => {
  createMainWindow()

  //implement menu

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  //remove mainWindow from memory on close
  mainWindow.on("closed", () => (mainWindow = null))

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

//  respond to ipcRenderer resize

ipcMain.on("image:resize", (e, options) => {
  options.dest = path.join(os.homedir(), "imageresizer")
  resizeImage(options)
})

//Resize the Image
async function resizeImage({ imgPath, height, width, dest }) {
  try {
    // console.log(imgPath, height, width, dest);

    // Resize image
    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    })

    // Get filename
    const filename = path.basename(imgPath)

    // Create destination folder if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest)
    }

    // Write the file to the destination folder
    fs.writeFileSync(path.join(dest, filename), newPath)

    // Send success to renderer
    mainWindow.webContents.send("image:done")

    // Open the folder in the file explorer
    shell.openPath(dest)
  } catch (err) {
    console.log(err)
  }
}

app.on("window-all-closed", () => {
  if (!isMac) app.quit()
})

// Open a window if none are open (macOS)
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})
