'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`
let checkLogin = false;
let userInfo = {};
let loginWindow;
function createLoginWindow (args) {
  loginWindow = new BrowserWindow({
    width: 250
    , height: 390
    , show: args.show
    , parent: mainWindow
    , model: true
    , frame: false
    , transparent: true
    , hasShadow: false
  });
  //loginWindow.loadURL('http://m.zhaopin.com/account/login?prevUrl=http%3A//m.zhaopin.com/');
  loginWindow.loadURL(`file://${__dirname}/login.html`);


  loginWindow.on('closed', () => {
    loginWindow = null;
    if (checkLogin) {
      mainWindow.show();
    }
  });
}

function createWindow () {
  if (userInfo.hasOwnProperty('username')) {
    // 未登录, 显示登录框
    checkLogin = true;
  } else {
    // 已经登录, 显示主窗口
    checkLogin = false;
  }

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600
    , width: 800
    , show: false
  })

  mainWindow.loadURL(winURL)
  //mainWindow.loadURL(`file://${__dirname}/login.html`);

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')

  !checkLogin && createLoginWindow({
    show: !checkLogin
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('login_bak', function (res) {
  if (res.username == 'ls' && res.password == '123') {
    // 登录成功
    userInfo = {
      username: 'ls',
      password: '123'
    }
    checkLogin = true;
    ipcMain.emit('login-status', {status: 1, errsmg: '登录成功'});
    loginWindow.close();
  } else {
    // 登录失败
    checkLogin = false;
    ipcMain.emit('login-status', {status: 0, errsmg: '登录失败'});
  }
})
