Page({
  data: {
    intervalNumber: '',
    record: {},
    hasUserInfo: false,
  },
  onLoad: function (options) {
    this.setData({
      hasUserInfo: wx.getStorageSync('hasUserInfo'),
      record: wx.getStorageSync('record')
    })
  },
  onShow: function () {
    this.setData({
      hasUserInfo: wx.getStorageSync('hasUserInfo'),
      record: wx.getStorageSync('record')
    })
    //定时获取消息数量并提示
    this.setData({
      intervalNumber: setInterval(this.getMsgNum, 1000)
    })
  },
  getMsgNum(e) {
    //获取未读数
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getMsgNum',
        openId: wx.getStorageSync('openId')
      }
    }).then(resp => {
      if (resp.result.list.length != 0) {
        wx.setTabBarBadge({
          index: 3,
          text: resp.result.list[0].unReadNum.toString()
        })
      }
    }).catch((e) => {
      console.log(e);
    });
  },
  //登录
  login(e) {
    wx.getUserProfile({
      desc: '登录',
      success: (res) => {
        //检查是否注册过
        wx.cloud.callFunction({
          name: 'myFunctions',
          config: {
            env: "cloud1-5gkp8gvb02539afe"
          },
          data: {
            type: 'findUser',
            openId: wx.getStorageSync('openId'),
          }
        }).then((resp) => {
          //已注册
          if (resp.result.data.length != 0) {
            this.getRecord(wx.getStorageSync('openId'))
          }
          //未注册
          else {
            wx.cloud.callFunction({
              name: 'myFunctions',
              config: {
                env: "cloud1-5gkp8gvb02539afe"
              },
              data: {
                type: 'addUser',
                openId: wx.getStorageSync('openId'),
                nickName: res.userInfo.nickName,
                imgURL: res.userInfo.avatarUrl,
              }
            })
            //获取时间并转换格式
            var postDate = new Date();
            var year = postDate.getFullYear(),
              month = postDate.getMonth() + 1,
              date = postDate.getDate(),
              h = postDate.getHours(),
              m = postDate.getMinutes(),
              month = this.checkTime(month),
              date = this.checkTime(date),
              h = this.checkTime(h),
              m = this.checkTime(m)
            var commentTime = '' + year + '/' + month + '/' + date + ' ' + h + ':' + m;
            //发送系统消息
            wx.cloud.callFunction({
              name: 'myFunctions',
              config: {
                env: "cloud1-5gkp8gvb02539afe"
              },
              data: {
                type: 'addMsg',
                commentTime: commentTime,
                openId: wx.getStorageSync('openId')
              }
            })
            this.getRecord(wx.getStorageSync('openId'))
          }
        }).catch((e) => {
          console.log(e);
        });
      }
    })
  },
  //日期格式转换成2位
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  //获取记录
  getRecord(openId) {
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'findUser',
        openId: openId,
      }
    }).then((resp) => {
      this.setData({
        hasUserInfo: true,
        record: resp.result.data[0],
      })
      wx.setStorageSync('hasUserInfo', this.data.hasUserInfo);
      wx.setStorageSync('record', this.data.record)
    }).catch((e) => {
      console.log(e);
    });
  },
  bindClear(e) {
    this.setData({
      hasUserInfo: false,
      record: {}
    })
    wx.setStorageSync('hasUserInfo', false);
    wx.setStorageSync('record', {});
    wx.showToast({
      title: '退出账号成功',
    })
  },
  navigatorToSetting() {
    wx.navigateTo({
      url: "../setting/my_setting/my_setting",
      events: {
        logOut: data => {
          this.setData({
            hasUserInfo: false,
            record: {}
          })
          wx.setStorageSync('hasUserInfo', this.data.hasUserInfo);
          wx.setStorageSync('record', this.data.record);
        },
        logOff: data => {
          this.setData({
            hasUserInfo: false,
            record: {}
          })
          wx.setStorageSync('hasUserInfo', this.data.hasUserInfo);
          wx.setStorageSync('record', this.data.record);
        }
      }
    })
  },
  onHide: function () {
    clearInterval(this.data.intervalNumber);
  }
})