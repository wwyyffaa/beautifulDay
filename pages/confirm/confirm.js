// 调用数据库值
// var confirmsData = require("../../dadt/data.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据***********************************************
   */
  data: {
    totalPrice: '',
    addOrders:[]
  },

  /* 点击减号 ************************************************/
  bindMinus: function (event) {
    // 获取当前点击的id号
    var id = event.currentTarget.dataset.goodsid;
    // 遍历出所有数据
    for (var i = 0; i < this.data.welcomes_key.length; i++) {
      if (id == this.data.welcomes_key[i].goodsId) {
        var id = event.currentTarget.dataset.goodsid;
        var carts = this.data.welcomes_key;
        this.data.welcomes_key[i].num -= 1;
        // 如果商品数量小于0
        if (this.data.welcomes_key[i].num == 0) {
          // 如果购物车为空,则跳转到首页
          this.getTotalPrice();
          var nums = this.data.totalNum;
          if (nums===0) {
            // wx.navigateTo({
            //   url: '/pages/index/index',
            // })
            wx.removeStorageSync("carts");
            wx.navigateBack()
          } else {
            // 如果不为空,重新计算总价格
            this.getTotalPrice();
          }
        }
        this.setData({
          welcomes_key: carts
        });
        console.log(carts);
        // 设置缓存
        wx.setStorage({
          key: "carts",
          data: carts
        })
      }
    }
    // 将做好逻辑的值存入数据表
    this.setData({
      welcomes_key: this.data.welcomes_key
    })
    // 调取计算价钱函数
    this.getTotalPrice();
  },

  /* 点击加号 ***********************************************/
  bindPlus: function (event) {
    var id = event.currentTarget.dataset.goodsid;

    for (var i = 0; i < this.data.welcomes_key.length; i++) {
      if (id == this.data.welcomes_key[i].goodsId) {
        this.data.welcomes_key[i].num += 1;
      }
    }

    // 设置缓存
    wx.setStorage({
      key: "carts",
      data: this.data.welcomes_key
    })
    // 将做好逻辑的值存入数据表
    this.setData({
      welcomes_key: this.data.welcomes_key
    })
    // 调取计算价钱函数
    this.getTotalPrice();
  },

  // 价格计算函数**********************************************
  getTotalPrice() {
    // 获取购物车列表
    let carts = this.data.welcomes_key;
    let total = 0;
    let num = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < this.data.welcomes_key.length; i++) {
      // 所有价格加起来
      total += this.data.welcomes_key[i].num * this.data.welcomes_key[i].goodsXj;
      num += this.data.welcomes_key[i].num;
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      welcomes_key: carts,
      totalPrice: total.toFixed(2),
      totalNum:num
    });

  },


  /**
   * 生命周期函数--监听页面加*****************************************
   */
  onLoad: function (options) {
    var that = this;
    var postsCollected = wx.getStorageSync("carts");
    this.setData({
      welcomes_key: postsCollected
    })

    //设置加菜次数的缓存
    wx.getStorage({
      key: 'addC',
      success: function (res) {
        that.setData({
          addC: res.data
        })
      },
      fail:function(){
        wx.setStorage({
          key: 'addC',
          data: 0,
        })
        wx.getStorage({
          key: 'addC',
          success: function(res) {
            that.setData({
              addC: res.data
            })
          },
        })
      }
    })
    this.getTotalPrice();
  },
  //  confirm页列表点击后穿到提交后的页面
  onPostTap: function (event) {
    var that = this;
    wx.getStorage({
      key: 'addOrders',
      success: function(res) {
        that.data.addC +=1
        res.data.push(
          {
            addNum: that.data.totalNum,
            addSum: that.data.totalPrice,
            addC: that.data.addC,
            addList: that.data.welcomes_key
          }
        )
        wx.setStorage({
          key: 'addOrders',
          data: res.data
        })
        wx.setStorage({
          key: 'addC',
          data: that.data.addC
        })
      },
      fail:function(res){
        that.data.addC += 1;
        wx.setStorage({
          key: 'orders',
          data: that.data.welcomes_key
        })
        wx.setStorage({
          key: 'addOrders',
          data: []
        })
        wx.setStorage({
          key: 'addC',
          data: that.data.addC
        })
      }
    })
    wx.getStorage({
      key: 'carts',
      success: function(res) {
        for(var i =0;i<res.data.length;i++){
            res.data[i].num=0;
        }
        wx.setStorage({
          key: 'carts',
          data: res.data,
        })
      },
    })
    wx.switchTab({
      url: '/pages/order/order',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onShow();  
      } 
    })
  },



})