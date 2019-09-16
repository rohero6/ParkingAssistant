// pages/packing/packing.js
var util=require("../../utils/util.js");
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
const db = wx.cloud.database()
var app=getApp();
Page({ 
  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    active:0,
    inputLen: 4,
    iptValue: "",
    isFocus: false,
    startTime:'',
    endTime:null,
    isUsed:0,
    berthNumber:0,
    stime:0,
    etime:0,
    spaceLen:9,
    packingState:[],
    markers: [],
    iconPath: "/images/park.png",
    latitude: 39.91652,
    longitude: 116.39712,
    
    },
  getMyPackingState:function(){
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
    wx.showLoading({
      title: '加载停车位状态中',
    })
    db.collection("packingState").get().then(res=>{
      console.log(res);
      this.setData({
        packingState:res.data,
        iptValue: ""
      });
      wx.hideLoading();
    }).catch(err=>{
      console.error(err);
      wx.hideLoading();
    })
    }
  },

  packingNumber:function(){
    var that=this;
    this.setData({
      startTime: util.formatTime(new Date()),
    })
    db.collection("order").add({
     data:{
       berthNumber: this.data.berthNumber,
       startTime: this.data.startTime,
       endTime:this.data.endTime,
       isUsed:1 ,
       stime: new Date().getTime()
     }
    }).then(res=>{
      console.log(res);
      db.collection("packingState").where({
        berthNumber:this.data.berthNumber
      }).get().then(res=>{
        wx.cloud.callFunction({
          name: 'updatePackingState',
          data: {
            id:res.data[0]._id,
            state: 1
          }
        })
        wx.showToast({
          title: '停车成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              that.getMyPackingState();
            }, 2000) //延迟时间
          }
        })
      })
      
      }).catch(err=>{
      console.error(err);
    })
  },
  onFocus: function (e) {
    var that = this;
    that.setData({ isFocus: true });
  },
  bottonTap:function(event){
    this.setData({
      iptValue :event.target.dataset.berth,
      berthNumber: event.target.dataset.berth
    });
  },
  setValue: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({ 
      iptValue: e.detail.value,
      berthNumber:e.detail.value
       });
    
  },
  mapto:function(event){
    console.log(event.target.dataset.mapdel);
     wx.openLocation({
      latitude: event.target.dataset.mapdel.location.lat,
      longitude: event.target.dataset.mapdel.location.lng,
       name: event.target.dataset.mapdel.title,
       address: event.target.dataset.mapdel.address,
    })
  },
  gotlocation:function(){
    wx.getLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    })
  },

  
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.LOGINED) {
      wx.showLoading({
        title: '加载停车位状态中',
      })
      db.collection("packingState").get().then(res => {
        console.log(res);
        this.setData({
          packingState: res.data,
          iptValue: ""
        });
        wx.hideLoading();
      }).catch(err => {
        console.error(err);
        wx.hideLoading();
      })
    }
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'LPHBZ-RDFCU-4NOV4-2LK6R-DHKY5-R5BNO'
    });
    this.getloc();
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
   this.getMyPackingState();

    var that = this;
    qqmapsdk.search({
      keyword: '停车场',
      success: function (res) {
        console.log(res);
        that.setData({
          markers: res.data
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})