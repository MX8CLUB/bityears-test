const low = window.require('lowdb');
const {remote} = window.require('electron');
const path = require('path');
const fs = window.require('fs');
const FileSync = window.require('lowdb/adapters/FileSync');
let url = path.join(remote.app.getPath('userData'), 'db.json');
let adapter = null;
let db = null;
/**
 * 初始化数据库
 */
export function init() {
    if(!fs.existsSync(url)){
        fs.writeFileSync(url, '');
        adapter = new FileSync(url);
        db = low(adapter);
        db.defaults({
            whiteList: [
                {
                    "name": "梦想吧",
                    "url": "https://www.mx8.club/"
                }
            ],
            blackList: [],
            urlList: [
                "www.mx8.club"
            ],
            workNumber: 10,
            timeout: 20
        })
            .write()
    }else{
        adapter = new FileSync(url);
        db = low(adapter);
    }
}

/**
 * 获取网址列表
 */
export function getUrlList() {
    let collection = db.get('urlList');
    return collection.value();
}

/**
 * 获取白名单
 */
export function getWhiteList() {
    let collection = db.get('whiteList');
    return collection.value();
}

/**
 * 增加白名单
 * @param name
 * @param url
 */
export function addWhiteList(name, url) {
    let collection = db.get('whiteList');
    let result = collection.find({name, url}).value();
    if(!result){
        collection.push({name, url}).write();
    }
    return true;
}

/**
 * 工作任务数
 * @returns {*}
 */
export function getWorkNumber() {
    let collection = db.get('workNumber').value();
    return collection;
}

/**
 * 超时时间
 * @returns {*}
 */
export function getTimeout() {
    let collection = db.get('timeout').value();
    return collection;
}
