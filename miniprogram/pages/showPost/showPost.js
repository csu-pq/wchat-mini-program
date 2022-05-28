Page({
  /**
   * 页面的初始数据
   */
  data: {
    price: '',
    pay: false,
    time: 0,
    items: [
      { name: '0', value: '置顶1小时10.88元', price: 10.88, time: 1 },
      { name: '1', value: '置顶3小时28.88元', price: 28.88, time: 3 },
      { name: '2', value: '置顶5小时48.88元', price: 48.88, time: 5 },
      { name: '3', value: '置顶8小时78.88元', price: 78.88, time: 8 },
    ],
    zhiding: false,
    hasUserInfo: false,
    post: {},
    record: {},

    myMsg: '',
    sendTo: '',
    comment: '',
    commentTo: '',
    commentTo2: '',
    commentTo2Id: '',
    placeholder: '评论千万条，友善第一条',

    postUserInfo: {},

    shoucang: false,
    shoucangNum: 0,
    dianzan: false,
    dianzanNum: 0,
    //降序与升序排列
    talks: [],
    talks_asc: [],
  },
  //图片预览
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.post.imgURL, // 需要预览的图片http链接列表
    });
  },
  //获取帖子信息
  async getPostById(pagePostId) {
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getPostById',
        postId: pagePostId,
      }
    }).then(resp => {
      if(resp.result.data.length==0){
        this.setData({post:null})
      }
      else{
        this.setData({
          post: resp.result.data[0]
        })
      }
    })
  },
  //根据帖子id获取发帖人头像和昵称
  async getPostUserInfo(postOpenId) {
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'findUserByOpenId',
        openId: postOpenId,
      }
    }).then(resp => {
      this.setData({
        postUserInfo: resp.result.data[0]
      })
    })
  },
  //获取是否收藏和点赞
  async whetherIsFavoriteAndDianZan(postId) {
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'dealFavorite',
        method: '查找收藏',
        postId: postId,
      }
    }).then(resp => {
      if (resp.result.data.length != 0) {
        this.setData({
          shoucang: true
        })
      }
    })
    //查找点赞
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'dealDianZan',
        method: '查找点赞',
        postId: postId,
      }
    }).then(resp => {
      if (resp.result.data.length != 0) {
        this.setData({
          dianzan: true
        })
      }
    })
  },
  //获取点赞和收藏总数
  async refreshNum(e) {
    //获取点赞数
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getCount',
        name: '获取点赞数',
        postId: this.data.post.postId,
      }
    }).then(resp => {
      if (resp.result.list.length != 0) {
        this.setData({
          dianzanNum: resp.result.list[0].dianzanNum
        })
      }
      else {
        this.setData({
          dianzanNum: 0
        })
      }
    })
    //获取收藏数
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getCount',
        name: '获取收藏数',
        postId: this.data.post.postId,
      }
    }).then(resp => {
      if (resp.result.list.length != 0) {
        this.setData({
          shoucangNum: resp.result.list[0].shoucangNum
        })
      }
      else {
        this.setData({
          shoucangNum: 0
        })
      }
    })
  },
  //置顶
  zhiding_open(e) {
    this.setData({
      zhiding: true
    })
  },
  zhiding_close(e) {
    this.setData({
      zhiding: false,
      pay: false,
      price: "",
      time: 0,
    })
  },
  preventTouch(e) {
  },
  radioChange(e) {
    this.setData({
      pay: true,
      price: this.data.items[e.detail.value].price,
      time: this.data.items[e.detail.value].time,
    })
  },
  zhiding_pay(e) {
    var that = this;
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'wxPay'
      },
      success: res => {
        console.log(res)
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success(res) {
          },
          fail(err) {
            console.error('pay fail', err)
            that.zhiding(that.data.time);
            wx.showToast({
              title: '置顶成功',
            })
            that.sleep(1000);
            wx.reLaunch({
              url: '../index/index',
            })
          }
        })
      },
    })
  },
  zhiding(time) {
    //未置顶
    if (this.data.post.zhidingTime <= Date.parse(new Date())) {
      wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'zhiDing',
          isZhingDing: false,
          postId: this.data.post.postId,
          time: time,
        }
      })
    }
    //已置顶
    else {
      wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'zhiDing',
          isZhingDing: true,
          postId: this.data.post.postId,
          time: time
        }
      })
    }
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
  //获取输入框内容
  getComment(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  //日期格式转换成2位
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  //发布评论
  async submitComment(e) {
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
    //回复本贴
    if (this.data.commentTo == '' && this.data.comment != "") {
      await wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'addComment',
          openId: wx.getStorageSync('openId'),
          postId: this.data.post.postId,
          comment: this.data.comment,
          commentTo: '',
          level: "1",
          imgURL: this.data.record.imgURL,
          nickName: this.data.record.nickName,
          commentTime: commentTime,
          myMsg: this.data.myMsg,
          sendTo: this.data.sendTo,
        }
      }).then(resp => {
        this.setData({
          comment: ''
        })
      })
      this.showTalks();
    }
    //回复评论
    else if (this.data.comment != "") {
      await wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'addComment',
          postId: this.data.post.postId,
          openId: wx.getStorageSync('openId'),
          comment: this.data.comment,
          commentTo: this.data.commentTo,
          commentTo2: this.data.commentTo2,
          commentTo2Id: this.data.commentTo2Id,
          level: "2",
          imgURL: this.data.record.imgURL,
          nickName: this.data.record.nickName,
          commentTime: commentTime,
          myMsg: this.data.myMsg,
          sendTo: this.data.sendTo,
        }
      }).then(resp => {
        this.setData({
          comment: ''
        })
      })
      this.showTalks();
    }
  },
  //点击其它地方回复本贴
  changeCommentTo(e) {
    this.setData({
      placeholder: '评论千万条，友善第一条',
      commentTo: '',
      commentTo2: '',
      commentTo2Id: '',
      sendTo: this.data.post.openId,
      myMsg: "原帖：" + this.data.post.title
    })
  },
  //回复一级评论
  huifu(e) {
    this.setData({
      placeholder: "@" + e.currentTarget.dataset.nickname,
      commentTo: e.currentTarget.id,
      sendTo: e.currentTarget.dataset.openid,
      myMsg: e.currentTarget.dataset.comment
    })
  },
  //回复二级评论
  huifu2(e) {
    this.setData({
      placeholder: "@" + e.currentTarget.dataset.nickname,
      commentTo: e.currentTarget.dataset.commentto,
      commentTo2: e.currentTarget.dataset.nickname,
      commentTo2Id: e.currentTarget.id,
      sendTo: e.currentTarget.dataset.openid,
      myMsg: e.currentTarget.dataset.comment
    })
  },
  //收藏
  shoucang(e) {
    //已经收藏了，取消收藏
    if (this.data.shoucang) {
      wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'dealFavorite',
          method: '取消收藏',
          postId: this.data.post.postId,
        }
      }).then(resp => {
        this.setData({
          shoucang: false,
          shoucangNum: this.data.shoucangNum - 1
        })
      })
    }
    else {
      wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'dealFavorite',
          method: '收藏',
          postId: this.data.post.postId,
        }
      }).then(resp => {
        this.setData({
          shoucang: true,
          shoucangNum: this.data.shoucangNum + 1,
        })
      })
    }
  },
  //点赞
  dianzan(e) {
    //已经点赞了，取消点赞
    if (this.data.dianzan) {
      wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'dealDianZan',
          method: '取消点赞',
          postId: this.data.post.postId,
        }
      }).then(resp => {
        this.setData({
          dianzan: false,
          dianzanNum: this.data.dianzanNum - 1,
        })
      })
    }
    else {
      wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'dealDianZan',
          method: '点赞',
          postId: this.data.post.postId,
        }
      }).then(resp => {
        this.setData({
          dianzan: true,
          dianzanNum: this.data.dianzanNum + 1,
        })
      })
    }
  },
  //获取本贴所有评论
  showTalks(e) {
    //获取降序
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getComment',
        postId: this.data.post.postId,
        order: 'desc'
      }
    }).then(resp => {
      this.setData({
        talks: resp.result.data
      })
    })
    //获取升序
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getComment',
        postId: this.data.post.postId,
        order: 'asc'
      }
    }).then(resp => {
      this.setData({
        talks_asc: resp.result.data
      })
    })
  },
  onLoad: async function (options) {
    wx.showLoading({
      title: '',
    })
    this.setData({
      record: wx.getStorageSync('record'),
      hasUserInfo: wx.getStorageSync('hasUserInfo')
    })
    if (this.data.hasUserInfo) {
      var pagePostId = options.postId;
      await this.getPostById(pagePostId);
      if (this.data.post != null) {
        await this.getPostUserInfo(this.data.post.openId);
        await this.whetherIsFavoriteAndDianZan(this.data.post.postId);
        this.refreshNum();
        this.showTalks();
        this.setData({
          sendTo: this.data.post.openId,
          myMsg: "原帖：" + this.data.post.title,
        })
      }

    }
    wx.hideLoading();
  },
})