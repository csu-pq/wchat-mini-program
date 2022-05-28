
Page({
  data: {
    record: {},
    hasUserInfo: false,
  },
  onLoad: function (options) {
    this.setData({ hasUserInfo: wx.getStorageSync('hasUserInfo') });
    if (this.data.hasUserInfo) {
      this.LaodInfo();
    }
  },
  LaodInfo(e) {
    this.setData({
      record: wx.getStorageSync('record')
    })
  },
  subInfo(e) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'updateUser',
        data: this.data.record
      }
    }).then((resp) => {
      wx.hideLoading();
      wx.showToast({
        title: '修改成功',
      })
      this.sleep(1000);
      wx.setStorageSync('record', this.data.record);
      wx.reLaunch({
        url: '../../mine/mine',
      })
    }).catch((e) => {
      console.log(e);
    });
  },
  sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }
  },
  //5个输入框修改动作检测
  bindinput1(e) {
    const sign = e.detail.value;
    const record = this.data.record;
    record.sign = sign
    this.setData({
      record
    })
  },
  bindinput2(e) {
    const contact = e.detail.value;
    const record = this.data.record;
    record.contact = contact
    this.setData({
      record
    })
  },
  bindinput3(e) {
    const wechat = e.detail.value;
    const record = this.data.record;
    record.wechat = wechat
    this.setData({
      record
    })
  },
  bindinput4(e) {
    const QQ = e.detail.value;
    const record = this.data.record;
    record.QQ = QQ
    this.setData({
      record
    })
  },
  bindinput5(e) {
    const tel = e.detail.value;
    const record = this.data.record;
    record.tel = tel
    this.setData({
      record
    })
  },
})