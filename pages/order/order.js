//var orders = require('../../data/orders.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newaddDishList:[],
    allSum:0,
    allNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时  
    var h = date.getHours();
    //分  
    var m = date.getMinutes();
    //秒  
    var s = date.getSeconds();    
    this.setData({
      orderNum: timestamp,
      orderState:'进行中',
      orderTime: Y + '-' + M + '-' + D  + ' '+ h + ":" + m + ":" + s
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

    var that = this;
    wx.getStorage({
      key: 'addC',
      success: function (res) {
        that.setData({
          addC: res.data
        })
      },
      fail:function(){
        that.setData({
          addC:0
        })
      }
    })
    
    wx.getStorage({
      key: 'orders',
      success: function(res) {
        that.setData({
          order: res.data,
          priceSum: that.getSum(res.data)[0],
          numSum: that.getSum(res.data)[1],
        })
      that.getAllPic(that.data.numSum, that.data.priceSum);
      },
    })

    wx.getStorage({
      key: 'addOrders',
      success: function (res) {
        that.setData({
          height: app.globalData.myApp.windowHeight,
          addOrderList: res.data,
        })
      },
      fail: function (res) {

      }
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '外婆家点餐系统',
      path: '/page/index/index',
    }
  },
  //增加数量
  jia:function(e){
    var id = e.currentTarget.dataset.id;
    var list = e.currentTarget.dataset.list;
    if(list==1){
      var newPro = this.getPro(id, this.data.order);
      if (this.data.newaddDishList.length == 0) {
        this.data.newaddDishList.push(newPro);
        this.setData({
          newaddDishList: this.data.newaddDishList
        });

      }else{

        var len = this.data.newaddDishList.length;
        var flag = -1;
        for (var i = 0; i < len; i++) {
          //遍历所有对象，一旦有相等的，就追加num。else 追加对象
          if (newPro.id == this.data.newaddDishList[i].id) {
              flag = i;
              break;
          }
        }
        if (flag == -1) {
          this.data.newaddDishList.push(newPro);
          this.setData({
            newaddDishList: this.data.newaddDishList
          });
        } else {
          this.data.newaddDishList[flag].num++;
          this.setData({
            newaddDishList: this.data.newaddDishList
          });
        }
      }
    }
    else{
      var index = e.currentTarget.dataset.index;
      this.data.newaddDishList[index].num +=1;
      this.setData({
        newaddDishList: this.data.newaddDishList
      });
    }
     this.setData({
       addPriceSum: this.getSum(this.data.newaddDishList)[0],
       addNumSum: this.getSum(this.data.newaddDishList)[1],
    })
  },
  //减少数量
  jian: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    this.data.newaddDishList[index].num -= 1;
    this.setData({
      newaddDishList: this.data.newaddDishList
    });
    this.setData({
      addPriceSum: this.getSum(this.data.newaddDishList)[0],
      addNumSum: this.getSum(this.data.newaddDishList)[1],
    })
    console.log(this.data.newaddDishList);
  },
  //清除列表
  clearAll:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认清空加菜单吗？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            newaddDishList: []
          });
        }
      }
    })
  },
  //获取商品
  getPro:function(id,array){
    var newPro = null;
    for (var i = 0; i < array.length; i++) {
      if (id == array[i].goodsId) {
        newPro = 
          {
            id: array[i].goodsId,
            goodsName: array[i].goodsName,
            goodsEnName: array[i].goodsEnName,
            goodsXj: array[i].goodsXj,
            goodsUnit: array[i].goodsUnit,
            num: 1
          }
      }
    }
    return newPro;
  },
  //获取更多产品，去首页
  moreAdd:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //获取总价和总数
  getSum:function(array){
    var sum = 0;
    var num = 0;
    for(var i = 0;i<array.length;i++){
      sum += array[i].goodsXj * array[i].num;
      num += array[i].num
    }
    return [sum,num];
  },
  goadd:function(){
    var that = this;
    wx.showModal({
      title: '加菜提示',
      content: '确认加菜吗？',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'addOrders',
            success: function(res) {
              that.data.addC += 1
              res.data.push(
                {
                  addNum: that.data.addNumSum,
                  addSum: that.data.addPriceSum,
                  addC: that.data.addC,
                  addList: that.data.newaddDishList
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
              //清空加菜列表
              that.setData({
                newaddDishList: []
              });
              that.onShow();
              
              wx.getStorage({
                key: 'addOrders',
                success: function (res) {
                  that.setData({
                    height: app.globalData.myApp.windowHeight,
                    addOrderList: res.data,
                  })
                },
                fail: function (res) {

                }
              })  
              that.getAllPic(that.data.numSum, that.data.priceSum);
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getAllPic:function(num,price){
    var that = this;
    try {
      var value = wx.getStorageSync('addOrders')
      if (value) {
        var allNum = 0;
        var allSum = 0;
        for (var i = 0; i < value.length; i++) {
          allNum += parseInt(value[i].addNum);
          allSum += parseInt(value[i].addSum);
        }
        allNum +=num;
        allSum +=price;
        allSum = allSum.toFixed(2);
        that.setData({
          allNum: allNum,
          allSum: allSum
        })
      }
    } catch (e) {
     console.log(e);
    }  
  },
  gojs:function(){
    var that  = this;
    this.setData({
      newaddDishList: []
    })
    wx.navigateTo({
      url: '/pages/settlement/settlement?allPic=' + that.data.allSum,
    })
  }
})