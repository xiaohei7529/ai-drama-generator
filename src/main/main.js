/**
 * 主进程入口
 * AI Drama Generator - 主进程
 */

const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    frame: true,
    icon: path.join(__dirname, '../../build/icon.png'),
  })

  // 加载页面
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5174')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC 通信
ipcMain.handle('get-app-version', () => app.getVersion())
ipcMain.handle('get-app-path', (event, name) => app.getPath(name))

ipcMain.handle('select-output-dir', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '选择输出目录'
  })
  return result
})

ipcMain.handle('generate-script', async (event, params) => {
  // 调用 AI 剧本生成
  const { PythonShell } = require('python-shell')
  try {
    const results = await PythonShell.run('src/ai/script_generator.py', {
      args: [params.theme]
    })
    return { success: true, data: results }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

module.exports = { mainWindow }
