Page({
  data: {
    hasUserInfo: false
  },
  logOut_btn(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否要退出登录',
      success (res) {
        if (res.confirm) {
          that.logOut();
        } else if (res.cancel) {
        }
      }
    })
  },
  logOff_btn(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否要注销账号',
      success (res) {
        if (res.confirm) {
          that.logOff();
        } else if (res.cancel) {
        }
      }
    })
  },
  logOut(e) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit("logOut", {})
    wx.navigateBack()
    wx.showToast({
      title: '退出账号成功',
    })
  },
  logOff(e) {
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'logOff',
        openId: wx.getStorageSync('openId'),
      }
    }).then(resp => {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit("logOff", {})
      wx.navigateBack()
      wx.showToast({
        title: '注销账号成功',
      })
    }).catch((e) => {
      console.log(e);
    });
  },
  onLoad: function (options) {
    this.setData({
      hasUserInfo: wx.getStorageSync('hasUserInfo')
    })
  },
})