import {
    domain,
    login
} from '../../utils/util.js';

Page({

    data: {
        cart: [],
        sum: 0
    },

    /**
     * 组件的方法列表
     */
    getCart() {
        let self = this;
        wx.getStorage({
            key: 'cart',
            success(res) {
                if (res) {
                    let cart = res['data'];
                    let p = 0;

                    for (let i = 0; i < cart.length; i++) {
                        p += cart[i].num * cart[i].product.promotion_price
                    }

                    self.setData({
                        cart: cart,
                        sum: p
                    });
                }
            },
            fail(res) {
                self.setData({
                    cart: [],
                    sum: 0
                });
            }
        });
    },

    numChange(e) {
        let id = e.target.id;
        let cart = this.data.cart;
        let p = 0;
        for (let i = 0; i < cart.length; i++) {
            if (id == cart[i].product._id) {
                cart[i].num = e.detail;
            }
            p += cart[i].num * cart[i].product.promotion_price;
        }
        this.setData({
            cart: cart,
            sum: p
        });
        wx.setStorageSync('cart', cart);
    },

    remove(e) {
        let id = e.target.id;
        let cart = this.data.cart;
        let self = this;
        wx.showModal({
            title: '提示',
            content: '确认要删除该商品？',
            success(res) {
                if (res.confirm) {
                    let p = 0;
                    for (let i = 0; i < cart.length; i++) {
                        if (id == cart[i].product._id) {
                            cart.splice(i, 1);
                            i--;
                        }
                    }
                    // 重新计算一下总价
                    for (let j = 0; j < cart.length; j++) {
                        p += cart[j].num * cart[j].product.promotion_price;
                    }
                    // 更改页面数据
                    self.setData({
                        cart: cart,
                        sum: p
                    });
                    // 更新缓存中数据
                    wx.setStorageSync('cart', cart);
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });
    },

    settlement() {
        let self = this;
        if (this.data.sum == 0) {
            wx.showToast({
                title: '您没有添加需要支付的商品',
                icon: 'none',
                duration: 3000
            });
        } else {
            wx.request({
                url: domain + '/api/min/order/create',
                method: 'post',
                data: {
                    products: JSON.stringify(self.data.cart),
                    sumPrice: this.data.sum
                },
                header: {
                    Token: wx.getStorageSync('token')
                },
                success(res) {
                    if (res['status'] = 200) {
                        wx.navigateTo({
                            url: '../settlement/settlement?sn=' + res['data']['data']
                        });
                        // 订单创建成功后，清空购物车
                        wx.removeStorageSync('cart');
                    }
                }
            });
        }
    },

    onShow() {
        let self = this;
        login().then(() => {
            self.getCart();
        });
    }
})