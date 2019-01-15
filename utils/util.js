// api域名配置
const domain = 'http://192.168.1.104';
// 登录
const _login = userInfo => {
    let self = this;
    return new Promise(function (resolve, reject) {
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

const login = () => {
    return new Promise((resolve, reject) => {
        _auth().then(userInfo => {
            _login(userInfo);
            resolve(userInfo);
        });
    });
}

module.exports = {
    domain, 
    login
}
