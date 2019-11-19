import React from 'react';
import {Button, Col, Descriptions, Menu, PageHeader, Table, Tag} from "antd";
import {addWhiteList, getTimeout, getUrlList, getWhiteList, getWorkNumber} from "../utils/db";
import _ from 'lodash';
import XLSX from "xlsx";

const {remote} = window.require('electron');
const {BrowserWindow, dialog} = remote;
const fs = window.require('fs');
const path = window.require('path');

export default class Index extends React.PureComponent {
    constructor(props) {
        document.title = '网站测试工具 - 比特年华网络工作室出品';
        super(props);
        this.state = {
            url: this._initState(getUrlList()),
            whiteUrl: getWhiteList(),
            history: [],
            waitCheck: [],
            workNumber: getWorkNumber(),
            timeout: getTimeout(),
        };
    }

    /**
     * 初始化State
     * @param arr
     * @private
     */
    _initState(arr) {
        let r = [];
        arr.map((item, index) => {
            r.push({
                index: index,
                url: item,
                loading: false,
                state: 0, // 0待检查， 1成功， 2出错， 3未知域名
                title: '',
                status: '',
                statusText: '',
                end_url: '', // 最终域名
                // time: new Date().toLocaleString()
                time: ''
            })
        });
        // console.log({[name]: r});
        return r;
    }

    /**
     * 打开网页
     * @returns {string|Index._openUrl.props|*}
     * @private
     */
    _openUrl() {
        let waitCheck, index, url;
        // 超过10个拒绝执行
        if (_(this.state.url).filter({loading: true}).size() >= this.state.workNumber) {
            return;
        } else {
            waitCheck = this.state.waitCheck.shift();
            if (!waitCheck) return;
            index = waitCheck.index;
            url = waitCheck.url;
            let temp = this.state.url;
            temp[index].loading = true;
            this.setState({
                url: [...temp]
            }, () => this._openUrl());
        }

        if (!(url.substr(0, 7).toLowerCase() === "http://" || url.substr(0, 8).toLowerCase() === "https://")) {
            url = 'http://' + url;
        }
        let window = new BrowserWindow({
            width: 100,
            height: 100,
            show: false
        });
        let that = this;
        window.loadURL(url);

        // 定时器
        function _timer() {
            return setTimeout(() => {
                let temp = that.state.url;
                temp[index] = {
                    ...temp[index],
                    loading: false,
                    title: window.webContents.getTitle(),
                    status: '',
                    statusText: 'Unknown',
                    end_url: window.webContents.getURL(), // 最终域名
                    time: new Date().toLocaleString(),
                    state: 3, // 0待检查， 1成功， 2出错， 3未知域名
                };
                console.log('计时器结束' + temp[index].url);
                that.setState({
                    url: [...temp]
                }, () => {
                    timer && clearTimeout(timer);
                    window.close();
                    that._openUrl();
                });
            }, that.state.timeout * 1000);
        }

        let timer = _timer();
        window.webContents.on('did-navigate', (event, url, httpResponseCode, httpStatusText) => {
            let temp = [];
            temp.concat(this.state.url[index]);
            temp = {
                ...temp,
                title: window.webContents.getTitle(),
                url: url, // 最终域名
                time: new Date().toLocaleString()
            };
            console.log('加载成功' + temp.url);
            this._pushHistory(temp);
            // 如果在白名单内
            if (this._checkUrl(temp.title, temp.url)) {
                let temp = this.state.url;
                temp[index] = {
                    ...temp[index],
                    loading: false,
                    state: 1, // 0待检查， 1成功， 2出错， 3未知域名
                    title: window.webContents.getTitle(),
                    status: httpResponseCode,
                    statusText: 'Success',
                    end_url: url, // 最终域名
                    time: new Date().toLocaleString()
                };
                this.setState({
                    url: [...temp]
                }, () => {
                    timer && clearTimeout(timer);
                    window.close();
                    that._openUrl();
                });
            } else {
                timer && clearTimeout(timer);
                timer = _timer();
            }
        });
        window.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
            let temp = this.state.url;
            temp[index] = {
                ...temp[index],
                loading: false,
                state: 2, // 0待检查， 1成功， 2出错， 3未知域名
                status: errorCode,
                statusText: errorDescription,
                end_url: validatedURL, // 最终域名
                time: new Date().toLocaleString()
            };

            this.setState({
                url: temp
            }, () => {
                console.log('错误' + temp.url);
                timer && clearTimeout(timer);
                // window.close();
                that._openUrl();
            });
        });
    }

    /**
     * 检查连接
     * @param name
     * @param url
     * @private
     */
    _checkUrl(name, url) {
        let r = _.find(this.state.whiteUrl, {name, url});
        if (r) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 添加历史记录
     * @param data
     * @private
     */
    _pushHistory(data) {
        this.setState((state) => ({
            history: state.history.concat(data)
        }))
    }

    /**
     * 添加白名单
     * @param name
     * @param url
     * @param end_url
     * @private
     */
    _addWhiteList(name, url, end_url) {
        addWhiteList(name, end_url);
        let r = _(this.state.url)
            .find({url, end_url});
        let index = _.findIndex(this.state.url, r);
        let temp = this.state.url;
        temp[index].state = 1;
        temp[index].status = 200;
        temp[index].statusText = 'Success';
        this.setState({
            url: [...temp],
        })
    }

    render() {
        // if(_(this.state.url).find({loading: true}))
        //     document.title = '还剩' + _(this.state.url).filter({loading: true}).size() + '个';
        // else
        //     document.title = '网站测试工具 - 比特年华网络工作室出品';
        return (
            <div>
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                }}>
                    <Menu
                        theme={'dark'}
                        selectedKeys={'首页'}
                        mode={'horizontal'}
                    >
                        <Menu.Item
                            key={'首页'}
                        >
                            首页
                        </Menu.Item>
                        {/*<Menu.Item*/}
                        {/*    key={'URL列表'}*/}
                        {/*    onClick={() => {*/}
                        {/*        let win = new BrowserWindow({*/}
                        {/*            width: 1200,*/}
                        {/*            height: 800,*/}
                        {/*            parent: remote.getCurrentWindow(),*/}
                        {/*            modal: true,*/}
                        {/*            webPreferences: {*/}
                        {/*                nodeIntegration: true,*/}
                        {/*                webSecurity: false,*/}
                        {/*            },*/}
                        {/*        });*/}
                        {/*        console.log(path.join(remote.getCurrentWebContents().getURL(), '/urlList'));*/}
                        {/*        win.loadURL(path.join(remote.getCurrentWebContents().getURL(), '/urlList'))*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    URL列表*/}
                        {/*</Menu.Item>*/}
                    </Menu>
                    <PageHeader
                        ghost={false}
                        title="测试列表"
                        extra={[
                            <Button
                                key="1"
                                type="primary"
                                onClick={() => {
                                    // this._openUrl()
                                    let arr = [];
                                    this.state.url.map((item, index) => {
                                        arr.push({
                                            url: item.url,
                                            index: index
                                        })
                                    });
                                    this.setState({
                                        waitCheck: arr
                                    }, () => this._openUrl());
                                }}
                                disabled={_(this.state.url).find({loading: true})}
                            >
                                {_(this.state.url).find({loading: true}) ? '测试中' : '开始测试'}
                            </Button>,
                            <Button
                                key="2"
                                onClick={() => {
                                    // this._openUrl()
                                    let arr = [];
                                    this.state.url.map((item, index) => {
                                        if (item.state === 2 || item.state === 3) {
                                            arr.push({
                                                url: item.url,
                                                index: index
                                            })
                                        }
                                    });
                                    console.log(arr);
                                    this.setState({
                                        waitCheck: arr
                                    }, () => this._openUrl());
                                }}
                                disabled={_(this.state.url).find({loading: true})}
                            >
                                出错重试
                            </Button>,
                            <Button
                                key="3"
                                onClick={() => {
                                    const p = dialog.showSaveDialogSync({
                                        title: '存放文件地址',
                                        filters: [
                                            {name: '文档', extensions: ['txt']},
                                        ]
                                    });
                                    let s = '';
                                    this.state.url.map((item) => {
                                        if (item.state === 2 || item.state === 3) {
                                            s += item.url + '\r\n';
                                        }
                                    });
                                    fs.writeFileSync(p, s);
                                }}
                                disabled={_(this.state.url).find({loading: true})}
                            >导出错误地址</Button>,
                            <Button
                                key="4"
                                onClick={() => {
                                    let arr = [
                                        ['URL', 'Title', "Time"],
                                    ];
                                    this.state.history.map((item) => {
                                        arr.push([
                                            item.url,
                                            item.title,
                                            item.time,
                                        ])
                                    });
                                    const xs = XLSX.utils.aoa_to_sheet(arr);
                                    // const p = dialog.showSaveDialogSync({
                                    //     title: '存放文件地址',
                                    //     filters: [
                                    //         { name: '文档', extensions: ['xlsx'] },
                                    //     ]
                                    // });
                                    // console.log(xs);
                                    var new_workbook = XLSX.utils.book_new();
                                    XLSX.utils.book_append_sheet(new_workbook, xs, '测试结果');
                                    // fs.writeFileSync(p, new_workbook);
                                    XLSX.writeFile(new_workbook, '测试结果.xlsx');
                                    // console.log(p.replace(/\\/g, '/'))
                                }}
                                disabled={_(this.state.url).find({loading: true})}
                            >
                                导出历史记录
                            </Button>
                        ]}
                    >
                        <Descriptions size="small" column={2}>
                            <Descriptions.Item label="网址总数">{this.state.url.length}</Descriptions.Item>
                            <Descriptions.Item label="出错个数"><span
                                style={{color: 'red'}}>{_(this.state.url).filter({state: 2}).size()}</span></Descriptions.Item>
                            <Descriptions.Item
                                label="待测个数">{_(this.state.url).filter({state: 0}).size()}</Descriptions.Item>
                            <Descriptions.Item label="未知个数"><span
                                style={{color: 'red'}}>{_(this.state.url).filter({state: 3}).size()}</span></Descriptions.Item>
                            <Descriptions.Item
                                label="成功个数">{_(this.state.url).filter({state: 1}).size()}</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                </div>
                <Table
                    pagination={false}
                    scroll={{y: document.body.clientHeight-212-54}}
                    columns={[
                        {
                            title: 'ID',
                            dataIndex: 'index',
                            key: 'index',
                            render: item => item + 1
                        },
                        {
                            title: 'URL',
                            dataIndex: 'url',
                            key: 'url',
                        },
                        {
                            title: '标题',
                            dataIndex: 'title',
                            key: 'title',
                        },
                        {
                            title: '状态',
                            dataIndex: 'status',
                            key: 'status',
                        },
                        {
                            title: '状态信息',
                            dataIndex: 'statusText',
                            key: 'statusText',
                            render: item => {
                                if (item.loading) return <Tag color="#2db7f5">Loading...</Tag>;
                                switch (item.state) {
                                    case 0:
                                        return <Tag color="#2db7f5">等待中...</Tag>;
                                    case 1:
                                        return <Tag color="#87d068">{item.statusText}</Tag>;
                                    case 2:
                                        return <Tag color="red">{item.statusText}</Tag>;
                                    case 3:
                                        return <div>
                                            <Tag color="#2db7f5">{item.statusText}</Tag>
                                            <Button
                                                size={'small'}
                                                onClick={() => {
                                                    this._addWhiteList(item.title, item.url, item.end_url);
                                                }}
                                                disabled={_(this.state.url).find({loading: true})}
                                            >
                                                添加白名单
                                            </Button>
                                        </div>;
                                }
                            }
                        },
                        {
                            title: '最终访问URL',
                            dataIndex: 'end_url',
                            key: 'end_url',
                        }
                    ]}
                    dataSource={this.state.url.map((item) => {
                        return {
                            index: item.index,
                            url: item.url,
                            title: item.title,
                            status: item.status,
                            statusText: item,
                            end_url: item.end_url,
                        }
                    })}
                >
                </Table>
            </div>
        );
    }
};
