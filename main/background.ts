import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import * as fs from 'fs'
import { join } from 'path'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

ipcMain.on('save-pdf', async (event, { pdfBuffer })=> {
  const downloadPath = app.getPath('pictures')
  const filePath = join(downloadPath, 'example.pdf')

  try{
    fs.writeFileSync(filePath, Buffer.from(pdfBuffer, 'base64'))
    event.reply('pdf-saved', { success: true, path: filePath })
  }catch(error) {
    event.reply('pdf-saved', { success: false, error: error.message})
  }
})
