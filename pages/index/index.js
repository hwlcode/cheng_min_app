//index.js
import {
    domain
} from '../../utils/util.js';
//获取应用实例
const app = getApp()

Page({
    data: {
        banners: []
    },

    onLoad: function() {

    },

    onShow: function() {
        let self = this;
        wx.request({
            url: domain + '/api/min/activities/list',
            method: 'GET',
            success(res) {
                if (res['status'] = 200) {
                    self.setData({
                        banners: res['data']['data']
                    });
                }
            }
        });
        
    }
})