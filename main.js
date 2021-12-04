const { app, BrowserWindow } = require("electron")
const fs = require('fs')
const path = require('path')

function createWindow(bounds_info) {
  const win = new BrowserWindow(bounds_info)
  win.loadFile('index.html')
  return win
}

app.whenReady().then(() => {
    let info_path = path.join(app.getPath("userData"), "bound-info.json")
    let bounds_info
    try {
        bounds_info = JSON.parse(fs.readFileSync(info_path, 'utf-8'))
    } catch (e) {
        bounds_info = { width: 1000, height: 800 }
    }
    win = createWindow(bounds_info)
    win.setMenuBarVisibility(false);
    win.on('close', () => {
        fs.writeFileSync(info_path, JSON.stringify(win.getBounds()))
    })
})
