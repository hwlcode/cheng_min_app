// pages/address-form/address-form.js
import {
    domain, login
} from '../../utils/util.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: null,
        region: ['江西省', '九江市', '瑞昌市'],
        valid: {
            user: false,
            phone: false,
            address: false
        },
        id: ''
    },

    formSubmit(e) {
        let self = this;
        if (this.data.valid.user && this.data.valid.phone && this.data.valid.address) {
            if (this.data.id != '') {
                e.detail.value.id = self.data.id;
            }
            
            wx.request({
                url: domain + '/api/min/user/save-address',
                data: e.detail.value,
                method: 'post',
                header: {
                    Token: wx.getStorageSync('token')
                },
                success(res) {
                    if (res['status'] = 200) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            });
        } else {
            wx.showToast({
                title: '请添写有效信息',
                icon: 'none',
                duration: 3000
            })
        }
    },

    isReqired(e) {
        if (e.detail.value == '') {
            wx.showToast({
                title: '字段不能为空',
                icon: 'none',
                duration: 3000
            });
            this.data.valid[e.target.id] = false;
        } else {
            this.data.valid[e.target.id] = true;
        }
    },

    checkPhone(e) {
        if (!(/^1[34578]\d{9}$/.test(e.detail.value))) {
            wx.showToast({
                title: '请输入有效的手机号码',
                icon: 'none',
                duration: 3000
            });
            this.data.valid.phone = false;
        } else {
            this.data.valid.phone = true;
        }
    },

    getAddress(id) {
        let self = this;
        wx.request({
            url: domain + '/api/min/user/get-address-by-id',
            data: {
                id: id
            },
            method: 'get',
            header: {
                Token: wx.getStorageSync('token')
            },
            success(res) {
                if (res['status'] = 200) {
                    self.setData({
                        address: res['data']['data'],
                        region: res['data']['data']['region'],
                        valid: {
                            user: true,
                            phone: true,
                            address: true
                        }
                    })
                }
            }
        });
    },

    delAddress(e){
        let self = this;
        wx.showModal({
            title: '提示',
            content: '确认要删除该收货地址？',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: domain + '/api/min/user/del-address',
                        data: {
                            id: self.data.id
                        },
                        method: 'get',
                        header: {
                            Token: wx.getStorageSync('token')
                        },
                        success(res) {
                            if (res['status'] = 200) {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.id != undefined) {
            this.setData({
                id: options.id
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let self = this;
        login().then( () => {
            if (self.data.id != '') {
                self.getAddress(self.data.id);
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})