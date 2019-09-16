const db=wx.cloud.database();
var app=getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:[],
    personCarnum:null
  },
  onLoad: function () {
    this.carnumCheck();
  },
  carnumCheck(){
    db.collection("carnumber").where({
      _openid: app.globalData.OPEN_ID
    }).get().then(res => {
      console.log(res);
      if (res.data.length != 0) {
        db.collection("carnumber").doc(res.data[0]._id).get().then(res2 => {
          console.log(res2);
          this.setData({ personCarnum: res2.data.carnum, });
          app.globalData.CARNUM = res2.data.carnum;
        }).catch(err => { console.error(err); })
      }
      else if (res.data.length == 0 && app.globalData.LOGINED) {
        wx.showModal({
          title: '提示',
          content: '请先设置车牌',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../carnumber/carnumber'
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo);
    if(e.detail.userInfo!=null){
      this.setData({canIUse:false,userInfo:e.detail.userInfo});
      app.globalData.LOGINED=true;
      console.log(app.globalData.LOGINED);
      this.carnumCheck();
    }
    else{
     wx.showToast({
       title: '授权失败',
       image:'../../images/fail.png'
     })
      this.setData({ canIUse: true });
    }
    console.log(this.data.canIUse)
   
  },
  carnumber:function(){
    wx.navigateTo({
      url: '../carnumber/carnumber'
    })
  },
  myorder:function(){
   wx.switchTab({
     url: '/pages/packingDetail/packingDetail',
   })
  },
  onShow(){
    this.onLoad();
  },
})