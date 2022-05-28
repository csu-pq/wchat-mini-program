Page({
  data: {
    intervalNumber: '',
    //轮播图图片
    p_url: [["../../images/navigate/bb.jpg", "校本部"],
    ["../../images/navigate/td.jpg", "铁道校区"],
    ["../../images/navigate/nx.png", "南校区"],
    ["../../images/navigate/xx.jpg", "新校区"],
    ["../../images/navigate/xy.jpg", "湘雅校区"]],
    //搜索框
    inputShowed: false,
    inputVal: '',

    hasUserInfo: false,
    postList: {},
    postList_zhiding: {},
    rebangPost:[],
  },
  //展开输入框
  showInput() {
    this.setData({
      inputShowed: true,
    });
  },
  //隐藏输入框
  hideInput() {
    this.setData({
      inputVal: '',
      inputShowed: false,
    });
  },
  //清空输入框内容
  clearInput() {
    this.setData({
      inputVal: '',
    });
  },
  //获取输入框内容
  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value,
    });
  },
  //搜索框失去焦点
  lostBlur(e) {
    this.setData({
      inputShowed: false,
    });
  },
  //搜索动作
  searchSubmit(e) {
    if (this.data.inputVal != "") {
      wx.navigateTo({
        url: '../showSearchPost/showSearchPost?keyword=' + this.data.inputVal,
      })
      this.setData({
        inputVal: ''
      })
    }
  },
  getPostList(e) {
    //获取置顶的
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getZhiDingPost',
        category: '置顶',
      }
    }).then(resp => {
      this.setData({
        postList_zhiding: resp.result.data
      })
    }).catch((e) => {
      console.log(e);
    });
    //获取未置顶的
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getZhiDingPost',
        category: '未置顶',
      }
    }).then(resp => {
      this.setData({
        postList: resp.result.data
      })
    }).catch((e) => {
      console.log(e);
    });
  },
  showPostInfo(e) {
    wx.navigateTo({
      url: '../showPost/showPost?postId=' + e.currentTarget.id,
    })
  },
  showByCategory(e) {
    wx.navigateTo({
      url: '../classifyPost/classifyPost?category=' + e.currentTarget.id,
    })
  },
  showByCampus(e) {
    wx.navigateTo({
      url: '../classifyPost/classifyPost?campus=' + e.currentTarget.id,
    })
  },
  onShow: function () {
    wx.showLoading({
      title: '',
    })
    this.setData({
      hasUserInfo: wx.getStorageSync('hasUserInfo')
    })
    //获取全部帖子
    this.getPostList();
    //获取热榜标题
    this.getTitleMsg();
    //定时获取消息数量并提示
    this.setData({
      intervalNumber: setInterval(this.getMsgNum, 1000)
    })
    wx.hideLoading();
  },
  onPullDownRefresh: function () {
    this.onShow();
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
  onHide: function () {
    clearInterval(this.data.intervalNumber);
  },
  getTitleMsg(e){
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'dealReBang',
        name: '查找热榜',
      }
    }).then(resp => {
      this.setData({
        rebangPost: resp.result.data
      })
    }).catch((e) => {
      console.log(e);
    });
  },
  showRebang(e){
    wx.navigateTo({
      url: '../showReBangPost/showReBangPost'
    })
  }
})