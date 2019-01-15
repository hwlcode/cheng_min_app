// components/hot-products/hot-products.js
import { domain } from '../../utils/util.js';
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        products: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getProducts(page, cates, keywords) {
            let self = this;
            wx.request({
                url: domain + '/api/min/products/list?page=' + page + '&cates=' + cates + '&keywords=' + keywords,
                method: 'GET',
                success(res) {
                    if(res['data']['status'] == 200){
                        self.setData({
                            products: res['data']['data'],
                        });
                    }
                }
            })
        }
    },
    attached() {
        this.getProducts(1, '', '');
    }
})