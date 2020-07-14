// pages/settlement/settlement.js
import {
    domain, login, sendMessageToUser, formatTime
} from '../../utils/util.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sn: '', // 订单_id: 维一需要传进来的字段
        no: null, // 系统订单编号
        order: null,
        sumPrice: 0,
        address: null
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
                    });
                }
            }
        });
    },

    getOrders(id) {
        let self = this;
        wx.request({
            url: domain + '/api/min/order/get',
            method: 'get',
            data: {
                id: self.data.sn
            },
            header: {
                Token: wx.getStorageSync('token')
            },
            success(res) {
                if (res['status'] = 200) {
                    let json = res['data']['data'];
                    json['products'] = JSON.parse(json['products']);
                    // console.log(json);
                    self.setData({
                        order: json,
                        no: json['sn'],
                        sumPrice: json['sumPrice']
                    });
                    self.getAddress(json['address']['_id']);
                }
            }
        });
    },

    delOrder(){
        let self = this;
        wx.showModal({
            title: '提示',
            content: '订单删除后，将不再显示',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: domain + '/api/min/del-order',
                        method: 'get',
                        data: {
                            id: self.data.sn
                        },
                        header: {
                            Token: wx.getStorageSync('token')
                        },
                        success(res) {
                            if (res['status'] = 200) {
                                // console.log(res['data']['msg']);
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    });
                } else if (res.cancel) {
                    
                }
            }
        })
    },

    canncelOrder(e){
        let self = this;
        let formId = e.detail.formId;
        this.updateOrder({id: this.data.sn, status: 1000});

        // 发送模板消息
        let address = self.data.address.user + ' ' + self.data.address.phone + ' ' + self.data.address.region[0] + ' ' + self.data.address.region[1] + ' ' + self.data.address.region[2] + ' ' + self.data.address.address;
        sendMessageToUser('-SlANr3qc4UyLZb5v3t0Btx7QBK7tIcm2CxYQyQUPXU', formId, 'pages/all-orders/all-orders', {
            'keyword1': {//订单编号
                'value': self.data.no
            },
            'keyword2': {//商品清单
                'value': '小超市商品付款'
            },
            'keyword3': {//订单金额
                'value': self.data.sumPrice + '元'
            },
            'keyword4': {//订单状态
                'value': '订单己取消'
            },
            'keyword5': {//取消时间
                'value': formatTime(new Date(self.data.order.updatedAt))
            },
            'keyword6': {//收货地址
                'value': address
            }
        }, 'keyword3.DATA');

        wx.navigateBack({
            delta: 1
        })
    },

    updateOrder(data) {
        let self = this;
        wx.request({
            url: domain + '/api/min/order/update',
            method: 'post',
            data: data,
            header: {
                Token: wx.getStorageSync('token')
            },
            success(res) {
                if (res['status'] = 200) {
                    // console.log(res['data']['msg']);
                }
            }
        });
    },

    settlement(e) {
        let self = this;
        let formId = e.detail.formId;
        if (this.data.address == null) {
            wx.showToast({
                title: '请先完善收货地址',
                icon: 'none',
                duration: 3000
            });
        } else {
            wx.request({
                url: domain + '/api/min/wx_pay/order',
                method: 'post',
                data: {
                    attach: '程程便利店-商品付款',
                    body: '小超市商品付款',
                    out_trade_no: self.data.no,
                    total_fee: self.data.order.sumPrice
                },
                header: {
                    Token: wx.getStorageSync('token')
                },
                success(res) {
                    if (res['status'] = 200) {
                        let json = res['data']['data'];
                        wx.requestPayment({
                            timeStamp: json.timestamp,
                            nonceStr: json.noncestr,
                            package: json.package,
                            signType: 'MD5',
                            paySign: json.sign,
                            success(res) {
                                // 用户支付成功
                                self.updateOrder({ id: self.data.sn, status: 1 });
                
                                // 发送模板消息
                                let address = self.data.address.user + ' ' + self.data.address.phone + ' ' + self.data.address.region[0] + ' ' + self.data.address.region[1] + ' ' + self.data.address.region[2] + ' ' + self.data.address.address;
                                sendMessageToUser('qUBiUt2vB-W5TN_nDj-U7myfeabLqBuJllSziQg7RA4', formId, 'pages/all-orders/all-orders', {
                                    'keyword1': {//订单编号
                                        'value': self.data.no
                                    },
                                    'keyword2': {//下单时间
                                        'value': formatTime(new Date(self.data.order.createdAt))
                                    },
                                    'keyword3': {//商品清单
                                        'value': '小超市商品付款'
                                    },
                                    'keyword4': {//订单金额
                                        'value': self.data.sumPrice + '元'
                                    },
                                    'keyword5': {//订单状态
                                        'value': '付款成功'
                                    },
                                    'keyword6': {//客户名称
                                        'value': self.data.order.customer.userInfo.nickName
                                    },
                                    'keyword7': {//收货地址
                                        'value': address
                                    }
                                }, 'keyword4.DATA');

                                wx.navigateBack({
                                    delta: 1
                                })
                            },
                            fail(res) {
                                // 用户取消了支付 
                                self.updateOrder({ id: self.data.sn, status: 0 });
                                // 发送模板消息
                                sendMessageToUser('gfl7331RUZ7l8S8m9qg7tnyBi14Ci1VkbElhVVZG3gg', formId, 'pages/waiting-payment-order/waiting-payment-order', {
                                    'keyword1': {//订单编号
                                        'value': self.data.no
                                    },
                                    'keyword2': {//商品清单
                                        'value': '小超市商品付款'
                                    },
                                    'keyword3': {//订单金额
                                        'value': self.data.sumPrice + '元'
                                    },
                                    'keyword4': {//下单时间
                                        'value': formatTime(new Date(self.data._order.createdAt))
                                    },
                                    'keyword5': {//订单状态
                                        'value': '取消付款'
                                    }
                                }, 'keyword5.DATA');

                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        })
                    }
                }
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            sn: options.sn
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let self = this;
        login().then( () => {
            self.getOrders(self.data.sn);
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // wx.switchTab({
        //     url: '../cart/cart'
        // })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})