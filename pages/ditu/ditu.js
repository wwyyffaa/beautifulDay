//location.js
//获取应用实例

Page({
    data: {
    markers: [{
      latitude: 23.099994,
      longitude: 113.324520,
    }],
    covers: [{
      latitude: 23.099794,
      longitude: 113.324520,
      rotate: 10
    }, {
      latitude: 23.099298,
      longitude: 113.324129,     
      rotate: 90
    }]
  },
  onLoad: function () {
    console.log('地图定位！')
    var that = this
    wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          console.log(res)
            var latitude = res.latitude; 
            var longitude = res.longitude; 
            wx.openLocation({
              latitude:latitude,
              longitude:longitude,
              scale:1
            })
        }
    });
  },
})
