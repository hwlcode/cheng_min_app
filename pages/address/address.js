// pages/address/address.js
import {
    domain, login
} from '../../utils/util.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addresses: []
    },

    addAddress() {
        wx.navigateTo({
            url: '../address-form/address-form'
        });
    },

    getUserAddress() {
        let self = this;
        wx.request({
            url: domain + '/api/min/user/get-address',
            method: 'get',
            header: {
                Token: wx.getStorageSync('token')
            },
            success(res) {
                if (res['status'] = 200) {
                    self.setData({
                        addresses: res['data']['data']
                    });
                }
            }
        });
    },

    radioChange(e){
        this.setDefaultAddress(e.detail.value);
    },

    setDefaultAddress(id){
        let self = this;
        wx.request({
            url: domain + '/api/min/user/set-default-address',
            method: 'get',
            data: {
                id: id
            },
            header: {
                Token: wx.getStorageSync('token')
            },
            success(res) {
                if (res['status'] = 200) {
                    wx.showToast({
                        title: '默认收货地址设置成功',
                        icon: 'none',
                        duration: 3000
                    });
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
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
            self.getUserAddress();
        });
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