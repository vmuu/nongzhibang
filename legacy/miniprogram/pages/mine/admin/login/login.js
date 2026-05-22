// miniprogram/pages/mine/admin/login/login.js
const app = getApp()
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        form: {
            accountNumber: null,
            password: null
        }
    },
    change(e) {
        app.change(e, this)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.state()
        that.initData()
    },
    state() {
        that = this;
    },
    initData() {

    },
    empty() {
        let form = that.data.form;
        if (app.utils.isEmpty(form.accountNumber)) {
            app.utils.hint('管理员账号不能为空');
            return true;
        }
        if (app.utils.isEmpty(form.password)) {
            app.utils.hint('管理员账号不能为空');
            return true;
        }
        return false;
    },
    tapLogin() {
        app.utils.cl(that.data.form);
        if (that.empty()) return false;
        let accountNumber = that.data.form.accountNumber;
        let password = that.data.form.password;
        let where = {
            accountNumber: accountNumber
        }
        app.dbbase.queryWhere('admin', where).then(res => {
            app.utils.cl(res);
            if (res.data.length == 0) {
                app.utils.hint('账号不存在');
            } else if (res.data[0].password != password) {
                app.utils.hint('用户名或者密码错误');
            } else {
                app.globalData.admin = 1;
                wx.showToast({
                    title: '登录成功',
                    icon: 'loading',
                    success() {
                        wx.redirectTo({
                            url: '../admin',
                        })
                    }
                })
            }
        })


    }

})