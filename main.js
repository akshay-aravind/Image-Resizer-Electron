const path = require('path')
const { app, BrowserWindow } = require('electron')

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: 500,
        height: 600
    })

    mainWindow.loadFile(path.join(__dirname,'./renderer/index.html'));
}

app.whenReady().then(() => {
   app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})


app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})
