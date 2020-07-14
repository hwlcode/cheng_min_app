import { domain, login } from '../../utils/util.js';
let productsArray = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        windowHeight: 0, // 内容区域高度
        _page: 1, // 初始分页
        _total: 0, // 总产品数
        _hasMore: false, // 有无更多产品
    },

    getOrderList(page) {
        let self = this;
        wx.request({
            url: domain + '/api/min/order-list?status=0',
            data: {
                page: page
            },
            method: 'GET',
            header: {
                Token: wx.getStorageSync('token')
            },
            success(res) {
                let pageNum = 5;
                if (res['status'] = 200) {
                    let json = res['data']['data'];

                    json.map(order => {
                        order.products = JSON.parse(order.products);

                        if (order.status == 0) {
                            order.orderStatusText = '待付款';
                            order.statusClass = 'yellow';
                        }
                        else if (order.status == 1) {
                            order.orderStatusText = '己支付，待发货';
                            order.statusClass = 'green';
                        }
                        else if (order.status == 2) {
                            order.orderStatusText = '己发货';
                            order.statusClass = 'yellow';
                        }
                        else if (order.status == 1000) {
                            order.orderStatusText = '订单己取消';
                            order.statusClass = 'gay';
                        }
                    });

                    if (self.data._page == 1) {
                        self.setData({
                            orderList: json,
                            _total: res['data']['total']
                        });
                        json.map(item => {
                            productsArray.push(item);
                        });
                    } else {
                        json.map(item => {
                            productsArray.push(item);
                        });

                        self.setData({
                            orderList: productsArray,
                            _total: res['data']['total']
                        });
                    }

                    // 有无更多数据
                    if (self.data._total > pageNum * self.data._page) {
                        self.setData({
                            _page: ++self.data._page,
                            _hasMore: true
                        })
                    } else {
                        self.setData({
                            _hasMore: false
                        })
                    }
                }
            }
        });
    },

    goToDetail(e){
        let id = e.currentTarget.id;
        wx.navigateTo({
            url: '../order/order?sn=' + id,
        })
    },

    getMoreProduct() {
        if (this.data._hasMore) {
            this.getOrderList(this.data._page);
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
            self.getOrderList(1);
        });
        wx.getSystemInfo({
            success: function (res) {
                self.setData({
                    windowHeight: res.windowHeight
                });
            }
        });
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
        //     url: '../my/my'
        // })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;
        login().then(() => {
            self.getOrderList(1);
        });
        wx.getSystemInfo({
            success: function (res) {
                self.setData({
                    windowHeight: res.windowHeight
                });
            }
        });
        wx.stopPullDownRefresh();
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