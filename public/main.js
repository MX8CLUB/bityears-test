const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win;

function createWindow () {
    // 创建浏览器窗口。
    win = new BrowserWindow({
        title: '网站测试工具 - 比特年华网络工作室出品',
        width: 1200,
        height: 800,
        resizable: false,
        maximizable: false,
        // frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });
    // Menu.setApplicationMenu(null);
    if(process.env.NODE_ENV === 'dev'){
        // win.loadFile('../build/index.html');
        win.loadURL('http://localhost:3000/index.html');
    }else{
        // 加载index.html文件
        Menu.setApplicationMenu(null);
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
        // win.loadFile('../build/index.html');
    }
    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null;
        app.quit();
    });
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)
