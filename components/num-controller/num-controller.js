// components/num-controller/num-controller.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        num: Number
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        add() {
            this.setData({
                num: this.data.num + 1
            })
            this.triggerEvent('numChange', this.data.num);
        },
        sub() {
            if (this.data.num > 0) {
                this.setData({
                    num: this.data.num - 1
                })
            }
            this.triggerEvent('numChange', this.data.num);
        }
    }
})