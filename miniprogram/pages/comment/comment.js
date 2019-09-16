// pages/comment/comment.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    content:'', //评价的内容
    score:5, //评价的分数
    images:[] ,//要上传的图片
    fileIDs:[],
    movieid:-1
  },
  submit:function(){
    wx.showLoading({
      title: '评论中',
    })
    console.log(this.data.content, this.data.score);
    let promiseArr=[];
    for(let i=0;i<this.data.images.length;i++){
      let item=this.data.images[i];
      let suffix=/\.\w+$/.exec(item)[0];
      promiseArr.push(new Promise((resolve,reject)=>{
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime()+suffix,
          filePath: item, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIDs:this.data.fileIDs.concat(res.fileID)
          });
          resolve();
        }).catch(error => {
          console.log(error);
        })

      }));
     
    }

    Promise.all(promiseArr).then(res=>{
        db.collection("comment").add({
          data:{
            movieid:this.data.movieid,
            comment:this.data.comment,
            score:this.data.score,
            fileIDs:this.data.fileIDs
          }
        }).then(res=>{
          wx.hideLoading();
          wx.showToast({
            title: '评论成功',
          })
          console.log(res);
        }).catch(err=>{
          wx.hideLoading();
          wx.showToast({
            title: '评论失败',
          })
          cosole.error(err);
        })
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid:options.movieid
    });
    wx.cloud.callFunction({
      name:'getDetail',
      data:{
        movieid:options.movieid
      }
    }).then(res=>{
      console.log(res);
      this.setData({
        detail:JSON.parse(res.result)
      });
    }).catch(err=>{
      console.error(err);
    })
  },
  onContentChange:function(event){
    this.setData({
      content:event.detail
    });
    
  },
  onScoreChange:function(event){
    this.setData({
      score:event.detail
    });
  },
  uploadImg:function(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          images:this.data.images.concat(tempFilePaths)
        })
        
      }
    })
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