//app.js
const APP_ID ='wx48c3861b791c310f';
const APP_SECRET ='8fb4f27c16ad1bead88d570c6e2afa60';
App({
  
  onLaunch: function () {
    var that=this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data);
            that.globalData.OPEN_ID= res.data.openid;
            that.globalData.SESSION_KEY = res.data.session_key;
            console.log(that.globalData.OPEN_ID);
          }
        })
      }
    })



    this.globalData = {
        LOGINED:'',
        OPEN_ID: '',
        SESSION_KEY: '',
        CARNUM:""
    }
  }
})
