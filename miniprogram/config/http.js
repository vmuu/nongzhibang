import config from './config.js';
class Http {
  token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50SWQiOiJhZG1pbiIsIm5iZiI6MTYxOTc5NDY2MCwiZXhwIjoxNjE5Nzk0NzIwLCJpYXQiOjE2MTk3OTQ2NjB9.fTPbNq_rmfyXYxTuiBc0elS1BpBE1McYe5x1K530TTA`;
  /**
   * 获取缓存token
   */
  storage = () => {
    try {
      var value = wx.getStorageSync('user')
      if (value) {
        // Do something with return value
        this.token = value.token
      } else {
        //跳转到登录
        // wx.navigateTo({
        //   url: '/pages/login/login',
        // })
      }
    } catch (e) {
      // Do something when catch error
    }
  };



  requestUrl(url) {
    return config.net.api + url;
  }

  request(url, data, methodType = `GET`, contentType = `application/json; charset=UTF-8`) {
    return new Promise((success) => {
      wx.request({
        url: this.requestUrl(url),
        header: {
          'content-type': contentType,
          'Authorization': this.token,
        },
        method: methodType,
        data: data,
        success(res) {
          success(res.data);
        },
        error(e) {
          console.error(e);
        },
      });
    });
  }
  get = (url, data) => {
    return this.request(url, data);
  };
  post = (url, data) => {
    return this.request(url, data,'POST');
  };
  form = (url, data) => {
    let contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    return this.request(url, data, 'POST', contentType);
  }
};
export default new Http