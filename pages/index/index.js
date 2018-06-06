// pages/shoppingCart/index.js
var js_data = require('../../dadt/data.js');
var statusArrs = 0;
var num = 0;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.myApp.windowHeight,
    width: app.globalData.myApp.screenWidth,
    activeIndex: 0,
    showArr: statusArrs,
    flag: true,
    cartShow:'none',
    catyShow: 'none',
    showJia: 'none',
    cartHide: 'none',
    carArr: [],
    totalPrice : 0,
    totalCount : 0,
    cc:true,
    searchinput: '',
    style_img: '',
    animationData: {},
  },
  BeginSearch: function (e) {

    this.setData({
      searchinput: '',
    })
  },
  //导航切换
  changeTab: function (e) {
    var type = e.currentTarget.dataset.id;
    var scrId = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: type,
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        scrId: scrId,
      });
    }, 100);
  },

  // 滑动 
  onGoodsScroll: function (e) {
    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      activeIndex,
      len = this.data.category.length;
      // this.data.category.forEach(function (citem, i) {
      //   var _h = 70 + this.data.product.length * (46 * 3 + 20 * 2);
      //   if (scrollTop >= h - 100 / scale) {
      //     activeIndex = citem.gtId;
      //   }
      //   h += _h; 
      // });
      this.setData({
        activeIndex: activeIndex
      });
  },
  //拖拽切换
  // swiperTab: function (e) {
  //   var type = e.detail.current;
  //   this.setData({
  //     activeIndex: type,
  //   });
  // },
  //点击显示详情
  // tigger: function (e) {
  //   var type = e.currentTarget.dataset.index;
  //   this.setData({
  //     showArr: type
  //   });
  // },
  
  
//弹框
 
 hide:function(e){
   if (this.data.flag == true ) {
     this.setData({
       cartHide: 'none',
       flag: false
     })
   } else {
     this.setData({
       cartHide: 'block',
       flag: true
     })
   }
   var type = e.currentTarget.dataset.index;
   this.setData({
     showArr: type
   });
 },



 //加入购物车
 shopping: function (e) {
   var myE = e;
   var index = e.currentTarget.dataset.index;
   this.data.product[index].num += 1;
   this.setData({
     product: this.data.product

   })
   wx.setStorageSync("carts", this.data.product)
   //this.getCart(this.data.product);
   this.calTotalPrice();
   this.hide(myE);
 },
  

  // /**
  //   * 弹出层函数
  //   */
  // //出现
  show: function () {
    this.setData({
      cc: true
    })
    if (this.data.flag == true && this.data.cc && this.data.totalCount > 0 ) {
      this.setData({
        cartShow: 'block',
        flag: false
      })
    } else{
      this.setData({
        cartShow: 'none',
         flag: true
      })
    }

  },

//小红点
 hongdin:function(){
   if (this.data.totalCount > 0){
     this.setData({
       catyShow: 'block',
     })
   } else if (this.data.totalCount == 0){
     this.setData({
       catyShow: 'none',
     })
   }
 },


//点击字体放大
 onClickImage: function (e) {
   var that = this
   that.setData({
     style_img: 'transform:scale(1.1);'
   })
   setTimeout(function () {
     that.setData({
       style_img: 'transform:scale(1);'
     })
   }, 400)

 },


  // 点击加号
  addItems: function (e) {
  var index = e.currentTarget.dataset.index;
  // 获取点击的red状态
  this.data.product[index].red = false;
  this.data.product[index].num += 1;
  this.setData({
    product: this.data.product
  })
  wx.setStorageSync("carts", this.data.product)
  //this.getCart(this.data.product);
    this.calTotalPrice();
    this.hongdin();

    var index = e.currentTarget.dataset.index;

    // 获取点击的okid
    if (this.data.product[index].red == false) {

      this.setData({
        product: this.data.product,
      })
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay: 0,
      })
      this.animation = animation
      // 放大并移动
      this.animation.scale(1.5, 1.5).translate(0, 350).rotate(0).opacity(0).step({ duration: 400 });
      // 更新数据
      this.setData({
        animationData: this.animation.export()
      })



      // 返回
      setTimeout(function () {
        this.animation = animation
        //动画的脚本定义必须每次都重新生成，不能放在循环外
        animation.translate(0, 0).rotateZ(180).opacity(1).scale(1, 1).rotate(0).step({ duration: 70, timingFunction: "step-end", });
        // 更新数据
        var index = e.currentTarget.dataset.index;
        this.data.product[index].red = true;

        this.setData({
          // 导出动画示例
          product: this.data.product,
          animationData: animation.export(),

        })
      }.bind(this), 400);
    }

  },

  // 点击减号
  reduceItems: function (e) {

    var index = e.currentTarget.dataset.index;
    if (this.data.product[index].num > 0){
      this.data.product[index].num--
    };
    this.setData({
      product: this.data.product
    })
    wx.setStorageSync("carts", this.data.product)
    this.calTotalPrice();
    this.hongdin();
  },

   //计算总价
  calTotalPrice: function () {
    var carArray = this.data.product;
    var totalPrice = 0;
    var totalCount = 0;
    this.data.carArr = [];
    for (var i = 0; i < carArray.length; i++) {
      totalPrice += (carArray[i].goodsXj)*100 * carArray[i].num;
      totalCount += carArray[i].num;

      if (carArray[i].num>0){
        this.data.carArr.push(carArray[i]);
        this.setData({
          carArr: this.data.carArr
        })
      }
    }
    totalPrice = (totalPrice / 100).toFixed(2);
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
    });
    if (totalCount == 0){
      this.setData({
        cartShow: 'none',
      })
    }
  },
 

 //清空
  selectList:function(){
    var that = this;
    wx.getStorage({
      key: 'carts',
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].num = 0;
        }
        wx.setStorage({
          key: 'carts',
          data: res.data,
        })
        that.setData({
          product: res.data,
          totalPrice: 0,
          totalCount: 0,
          carArr: []
        })
      },
    })
    this.show();
      this.setData({
        catyShow: 'none',
      })

  },

//下单
  setbtn :function(){
    var that = this;
    if (this.data.totalCount >0) {
    wx.setStorage({
      key: 'carts',
      data: that.data.product,
      success:function(){
        wx.navigateTo({
          url: '/pages/confirm/confirm',
        })
      }
     })
      this.setData({
        cc: false
      })
    }
  this.show();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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
    this.setData({
      category: js_data.js_cate.category,
    })
    wx.getStorage({
      key: 'carts',
      success: function (res) {
        that.setData({
          product: res.data
        })
        that.calTotalPrice();
      },
      fail: function () {
        for (var i = 0; i < js_data.js_cate.product.length; i++) {
          var img = that.laJia(js_data.js_cate.product[i].huobao);
          js_data.js_cate.product[i].huobao = img;
        }
        wx.setStorage({
          key: 'carts',
          data: js_data.js_cate.product,
        })
        that.setData({
          product: js_data.js_cate.product,
          starP: js_data.js_cate.product
        })
        that.calTotalPrice();
        that.hongdin();
      }
    })

    this.setData({
      carArr: []
    })
  },
  laJia:function(num){
    switch (num) {
      case 1:
        return "  /images/hot1red.svg"
        break;
      case 2:
        return "/images/hot2red.svg"
        break;
      case 3:
        return "/images/hot3red.svg"
        break;
      case 4:
        return "/images/hot4red.svg"
        break;
      case 5:
        return "/images/hot5red.svg"
        break;        
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
    // wx.showNavigationBarLoading() //在标题栏中显示加载

    // //模拟加载
    // setTimeout(function () {
    //   // complete
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // }, 1500);
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

  },
})