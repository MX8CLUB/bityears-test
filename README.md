# bityears-test

<a href="https://github.com/MX8CLUB/bityears-test/releases"><img alt="GitHub release" src="https://img.shields.io/github/release/MX8CLUB/bityears-test.svg?color=blu"></a>
<a href="https://github.com/MX8CLUB/bityears-test/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/MX8CLUB/bityears-test.svg"></a>
<a href="https://github.com/MX8CLUB/bityears-test/network/members"><img alt="GitHub forks" src="https://img.shields.io/github/forks/MX8CLUB/bityears-test.svg"></a>
<a href="https://github.com/MX8CLUB/bityears-test/releases"><img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/MX8CLUB/bityears-test/total.svg?color=yellow"></a>

比特年华网站测试工具V1.1.0

使用Electron+React写的一款桌面应用，工作原因，做了这款工具，就是偷懒用的。自动化测试，UI采用Antd，数据库使用了轻量级json数据库管理--lowdb，总体代码不是很多，很多地方可能写的不是非常好。小毛病很多，不适合正式环境。

测试网址修改方法：
在项目第一次运行初始化之后，位于C:\Users\Administrator\AppData\Roaming\bityears-test目录下会生成一个db.json的文件，workNumber为最大任务数，timeout为超时时间，urlList为测试列表，数组形式

实现的功能有

- URL测试
- 错误地址导出（Txt）
- 测试历史记录导出（Excel）
- URL白名单

计划中功能

- 应用内修改URL列表
- URL黑名单列表
- URL白名单修改
- URL测试成功截图

## 目录

* [项目依赖](#项目依赖)
* [安装](#安装)
* [相关截图](#相关截图)

## 项目依赖
本项目采用依赖项目及版本如下
- "antd": "^3.25.1",
- "babel-plugin-import": "^1.12.2",
- "customize-cra": "^0.8.0",
- "lodash": "^4.17.15",
- "lodash-id": "^0.14.0",
- "lowdb": "^1.0.0",
- "react": "^16.11.0",
- "react-app-rewired": "^2.1.5",
- "react-dom": "^16.11.0",
- "react-router-dom": "^5.1.2",
- "react-scripts": "3.2.0",
- "xlsx": "^0.15.1"
- "cross-env": "^6.0.3",
- "electron": "^6.1.4",
- "electron-builder": "^22.1.0"

## 使用

github [项目地址](https://github.com/MX8CLUB/bityears-test)

本项目适用于相关技术人员学习交流，请自行编译安装

```sh
git clone https://github.com/MX8CLUB/bityears-test.git

cd bityears-test

yarn

# 启动React
yarn start
# 启动Electron
yarn estart
# 打包windows版本
yarn build&&yarn dist
```

## 相关截图

### 首页

![首页][1]

### 测试中

![测试中][2]

### 测试结束

![测试结束][3]

### 导出历史记录

![QQ导出历史记录][5]

  [1]: https://www.mx8.club/usr/uploads/2019/11/2103622306.png
  [2]: https://www.mx8.club/usr/uploads/2019/11/4149030414.png
  [3]: https://www.mx8.club/usr/uploads/2019/11/3982079810.png
  [4]: https://www.mx8.club/usr/uploads/2019/11/3982079810.png
  [5]: https://www.mx8.club/usr/uploads/2019/11/13990925.png