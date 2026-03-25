/**
 * 主进程入口
 * AI Drama Generator - Electron Main Process
 */

const { app, BrowserWindow, ipcMain, dialog, safeStorage } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow = null

// ---------- 工具：加密配置文件路径 ----------
function getConfigPath() {
  return path.join(app.getPath('userData'), 'settings.enc.json')
}

// ---------- 加密 / 解密 ----------
function encryptField(value) {
  if (!value) return ''
  try {
    return safeStorage.encryptString(value).toString('base64')
  } catch {
    return value
  }
}

function decryptField(value) {
  if (!value) return ''
  try {
    const buf = Buffer.from(value, 'base64')
    return safeStorage.decryptString(buf)
  } catch {
    return ''
  }
}

const SENSITIVE_FIELDS = ['dashscopeApiKey', 'ernieApiKey', 'iflytekApiKey']

function loadSettings() {
  const cfgPath = getConfigPath()
  if (!fs.existsSync(cfgPath)) return {}
  try {
    const raw = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'))
    const result = { ...raw }
    for (const field of SENSITIVE_FIELDS) {
      if (result[field]) result[field] = decryptField(result[field])
    }
    return result
  } catch {
    return {}
  }
}

function persistSettings(settings) {
  const toSave = { ...settings }
  for (const field of SENSITIVE_FIELDS) {
    if (toSave[field]) toSave[field] = encryptField(toSave[field])
  }
  fs.writeFileSync(getConfigPath(), JSON.stringify(toSave, null, 2), 'utf-8')
}

// ---------- 窗口 ----------
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
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ---------- IPC：基础 ----------
ipcMain.handle('get-app-version', () => app.getVersion())
ipcMain.handle('get-app-path', (_e, name) => app.getPath(name))

ipcMain.handle('select-output-dir', async () => {
  return dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '选择输出目录',
  })
})

// ---------- IPC：设置（加密） ----------
ipcMain.handle('settings:get', () => loadSettings())

ipcMain.handle('settings:save', (_e, settings) => {
  try {
    persistSettings(settings)
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('settings:reset', () => {
  try {
    const cfgPath = getConfigPath()
    if (fs.existsSync(cfgPath)) fs.unlinkSync(cfgPath)
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// ---------- IPC：Python 脚本生成 ----------
ipcMain.handle('generate-script', async (_e, params) => {
  const { PythonShell } = require('python-shell')
  const scriptPath = path.join(__dirname, '../../src/ai/script_generator.py')
  try {
    const results = await PythonShell.run(scriptPath, {
      args: [params.theme],
      pythonOptions: ['-u'],
    })
    return { success: true, data: results }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

module.exports = { mainWindow }
