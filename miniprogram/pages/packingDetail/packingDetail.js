// pages/packingDetail/packingDetail.js
const db=wx.cloud.database();
var util = require("../../utils/util.js");
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:[],
  
  },
  getMyOrder:function(){
    wx.showLoading({
      title: '加载中',
    })
    db.collection("order").where({ _openid: app.globalData.OPEN_ID }).get().then(res => {
      console.log(res);
      this.setData({
        detail: res.data
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
    })
  },
  CountUsedTime: function (stime) {
    var etime = new Date().getTime();
    var usedTime = etime - stime;
   
    var leave1 = usedTime % (24 * 3600 * 1000); //天数后剩余的毫秒数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    var hour = usedTime/(1000*3600);
    hour=hour.toFixed(1);
    console.log(minutes);
    console.log(hour + "h");
    return hour;
  },
  
  packingend:function(event){

    var berth = event.target.dataset.berth;
    var that =this;
    wx.showModal({
      title: '结束停车',
      content: '是否确认结束停车',
      success(res) {
        if (res.confirm) {
          db.collection('order').where({
            berthNumber:berth
          }).get().then(res=>{
            console.log(res.data[0]._id)
            console.log(res.data[0].stime);

            db.collection("packingState").where({
              berthNumber: berth
            }).get().then(res => {
              wx.cloud.callFunction({
                name: 'updatePackingState',
                data: {
                  id: res.data[0]._id,
                  state: 0
                }
              })
            })
            
            
            db.collection('order').doc(res.data[0]._id).update({
              data: {
                isUsed: 0,//将车位状态置空
                endTime: util.formatTime(new Date()),//记录结束时间
                usedTime: that.CountUsedTime(res.data[0].stime)//记录用时
              }
            }).then(res1 => {
              console.log(res1);
              wx.showToast({
                title: '结束成功！',
              })
              that.getMyOrder();
            }).catch(err => {
              console.error(err);
            })
          }).catch(err=>{
            console.error(err);
          })
            
        
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
    if (!app.globalData.LOGINED) {
      wx.showModal({
        title: '提示',
        content: '您还没有登录，请先登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/my',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/my/my',
            })
          }
        }
      })
    }
    else {
      this.getMyOrder();
    }
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMyOrder();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})