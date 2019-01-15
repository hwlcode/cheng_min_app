import { domain } from '../../utils/util.js';
let productsArray = [];

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
        num: 0, // 分类标识数，用于选中
        length: 0, // 用于判断有无数据
        cates: [],
        products: [],
        scrollTop: 0, // 用于初始化滚动条的位置
        _page: 1, // 初始分页
        _total: 0, // 总产品数
        _hasMore: false, // 有无更多产品
        _keywords: '',
        _cate: ''
    },
    /**
     * 组件的方法列表
     */
    methods: {
        selectMenu(e) {
            this.setData({
                num: e.target.dataset.index,
                _page: 1,
                _cate: e.target.dataset.id,
                _keywords: '',
                scrollTop: 0
            });
            this.getProducts(this.data._page, this.data._cate, this.data._keywords);
        },
        getCates() {
            let self = this;
            wx.request({
                url: domain+'/api/min/products/cate-list',
                method: 'GET',
                success(res) {
                    if (res['status'] = 200) {
                        self.setData({
                            cates: res['data']['data']
                        });
                    }
                }
            });
        },
        getProducts(page, cates, keywords) {
            let self = this;
            wx.request({
                url: domain+'/api/min/products/list?page=' + page + '&cates=' + cates + '&keywords=' + keywords,
                method: 'GET',
                success(res) {
                    let pageNum = 12;
                    if (res['status'] = 200) {
                        if (self.data._page == 1) {
                            self.setData({
                                products: res['data']['data'],
                                length: res['data']['data'].length,
                                _total: res['data']['total']
                            });
                            res['data']['data'].map(item => {
                                productsArray.push(item);
                            });
                        } else {
                            res['data']['data'].map(item => {
                                productsArray.push(item);
                            });

                            self.setData({
                                products: productsArray,
                                length: res['data']['data'].length,
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
            })
        },
        search(e) {
            this.setData({
                _page: 1,
                _cate: '',
                _keywords: e.detail.value
            })
            this.getProducts(this.data._page, this.data._cate, this.data._keywords);
        },
        getMoreProduct() {
            if (this.data._hasMore) {
                this.getProducts(this.data._page, this.data._cate, this.data._keywords);
            }
        }
    },

    ready() {
        // 获取分类
        this.getCates();

        // 获取产品
        this.getProducts(this.data._page, this.data._cate, this.data._keywords);
    }

})