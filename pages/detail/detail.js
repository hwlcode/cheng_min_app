// pages/detail/detail.js
import {
    domain, login
} from '../../utils/util.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        num: 0,
        product: null,
        cartNum: 0
    },

    goToCart() {
        //navigator需要跳转的应用内非 tabBar 的页面的路径
        wx.switchTab({
            url: '../cart/cart'
        });
    },

    numChange(e) {
        this.setData({
            num: e.detail
        });
    },

    addCart() {
        let arr = [];
        let obj = {};
        if (this.data.num < 1) {
            wx.showToast({
                title: '请先添加购买数量',
                icon: 'none',
                duration: 2000
            });
        } else {
            obj.num = this.data.num;
            obj.product = this.data.product;
            arr.push(obj);

            let cart = wx.getStorageSync('cart');
            if (cart) {
                let isExist = JSON.stringify(cart).indexOf(this.data.product._id) != -1;
                if (isExist) {
                    this.setData({
                        cartNum: cart.length
                    });
                    wx.showToast({
                        title: '购物车中己经存在该商品，无需重复添加',
                        icon: 'none',
                        duration: 2000
                    });
                } else {
                    cart.push(obj);
                    wx.setStorageSync('cart', cart);
                    this.setData({
                        cartNum: cart.length
                    });
                    wx.showToast({
                        title: '商品己经成功添加到购物车',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } else {
                wx.setStorageSync('cart', arr);
                this.setData({
                    cartNum: arr.length
                });
                wx.showToast({
                    title: '商品己经成功添加到购物车',
                    icon: 'none',
                    duration: 2000
                });
            }
        }
    },

    buyNow() {
        let self = this;
        login().then( ()=> {
            if (this.data.num < 1) {
                wx.showToast({
                    title: '请先添加购买数量',
                    icon: 'none',
                    duration: 2000
                });
            } else {
                let arr = [];
                let obj = {};
                obj['num'] = this.data.num;
                obj['product'] = this.data.product;
                arr.push(obj);
                
                wx.request({
                    url: domain + '/api/min/order/create',
                    method: 'post',
                    data: {
                        products: JSON.stringify(arr),
                        sumPrice: self.data.num * self.data.product.promotion_price
                    },
                    header: {
                        Token: wx.getStorageSync('token')
                    },
                    success(res) {
                        if (res['status'] = 200) {
                            wx.navigateTo({
                                url: '../settlement/settlement?sn=' + res['data']['data']
                            });
                        }
                    }
                });

            }
        });
    },

    getProductMsg(id) {
        let self = this;
        wx.request({
            url: domain + '/api/min/products/get?id=' + id,
            method: 'GET',
            success(res) {
                if (res['status'] = 200) {
                    res['data']['data'].content = res['data']['data'].content.replace(/<[^>]+>/g, '');
                    self.setData({
                        product: res['data']['data']
                    });
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.getProductMsg(this.data.id);
        wx.showShareMenu({
            withShareTicket: true
        });

        let cart = wx.getStorageSync('cart');
        if (cart) {
            this.setData({
                cartNum: cart.length
            });
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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