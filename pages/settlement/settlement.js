// pages/settlement/settlement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //  settlement页列表点击后结算价钱
  onPostList: function (event) {
    wx.showToast({
      title: '成功,取消缓存',
      icon: 'success',
      duration: 4000,
      success:function(){
        wx.switchTab({
          url: '/pages/index/index',
        })
        wx.clearStorage();
      }
    })
  },
  //  settlement页列表点击后返回上一个提交的页面
  onBackList: function (event) {
    wx.switchTab({
      url: '/pages/order/order',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      allSum: options.allPic
    })
    console.log(this.data);
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