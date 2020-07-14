const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
const formatTimeNew = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [hour, minute].map(formatNumber).join(':')
}
// api域名配置
const domain = 'https://admin.welcometo5g.cn';
// 登录
const _login = userInfo => {
    let self = this;
    return new Promise(function(resolve, reject) {
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求
                    wx.request({
                        url: domain + '/api/min/onLogin',
                        data: {
                            code: res.code,
                            userInfo: userInfo
                        },
                        method: 'POST',
                        success(res) {
                            res = res.data;
                            // console.log(res);
                            if (res.status == 200) {
                                wx.setStorage({
                                    key: 'token',
                                    data: res['data']
                                });
                            } else {
                                wx.showToast({
                                    title: res['msg'],
                                    icon: 'none',
                                    duration: 3000
                                })
                            }
                            resolve(res);
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                    reject(res.errMsg);
                }
            }
        });
    });
}
// 查看是否授权，获取用户信息
const _auth = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success(res) {
                            resolve(res.userInfo);
                        }
                    });
                } else {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('cart');
                    wx.redirectTo({
                        url: '../login/login'
                    });
                }
            }
        })
    });
}
// 返回promise登录，方便处理登录后的事件
const login = () => {
    return new Promise((resolve, reject) => {
        _auth().then(userInfo => {
            _login(userInfo);
            resolve(userInfo);
        });
    });
}

const _accessToken = () => {
    return new Promise((resolve, reject) => {
        _auth().then(userInfo => {
            _login(userInfo).then(data => {
                let openid = data.data;
                wx.request({
                    url: domain + '/api/min/get-access-token',
                    data: {
                        openid: openid
                    },
                    header: {
                        Token: wx.getStorageSync('token')
                    },
                    method: 'get',
                    success(res) {
                        resolve(res.data.data);
                    }
                })
            });
        });
    })
}

const sendMessageToUser = (template_id, form_id, page, data, emphasis_keyword) => {
    return new Promise((resolove, reject) => {
        _accessToken().then((access_token) => {
            let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token;
            let _jsonData = {
                access_token: access_token,
                touser: wx.getStorageSync('token'),
                template_id: template_id,
                form_id: form_id,
                page: page,
                data: data,
                emphasis_keyword: emphasis_keyword || ''
            }
            console.log(_jsonData);
            wx.request({
                url: url,
                data: _jsonData,
                method: 'post',
                success: function(res) {
                    resolove(res);
                },
                fail: function(err) {
                    console.log('request fail ', err);
                },
                complete: function(res) {
                    console.log("request completed!");
                }
            });
        });
    });
}

module.exports = {
    domain,
    login,
    sendMessageToUser,
    formatTime: formatTime,
    formatDate: formatDate,
    formatTimeNew: formatTimeNew
}