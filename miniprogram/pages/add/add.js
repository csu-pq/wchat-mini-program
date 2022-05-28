Page({
  data: {
    token: '',
    topTips: false,
    errorMsg: '',
    titleValid: false,
    contentValid: false,
    intervalNumber: '',
    record: {},
    //基本信息
    title: '',
    content: '',
    contact: '',
    wechat: '',
    QQ: '',
    tel: '',
    //校区
    campusList: ["铁道校区", "新校区", "南校区", "校本部", "湘雅校区"],
    campusIndex: 0,
    //帖子类型
    categoryList: ["二手闲置", "打听求助", "组队交友", "爱心公益"],
    categoryIndex: 0,
    //图片路径与数量
    files: [],
    imgNum: 0,
    
    //是否登录
    hasUserInfo: false,
    imgSrc: [],
    //计算热度所需数据
    postList_rb: {},
    visit: [],
    talks: [],
    contentNum: [],
    time: [],
    dianzan: [],
    shoucang: [],
    heatNum: [],
    heatIndex: [],
    titleMsg: [],
    rebangPost: [],
    tmpPost: [],
  },
  //输入框文本获取
  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  contentInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  contactInput(e) {
    this.setData({
      contact: e.detail.value
    })
  },
  wechatInput(e) {
    this.setData({
      wechat: e.detail.value
    })
  },
  QQInput(e) {
    this.setData({
      QQ: e.detail.value
    })
  },
  telInput(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  //选择图片
  async chooseImage() {
    const that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        if (that.data.imgNum + res.tempFiles.length <= 6) {
          for (var i = 0; i < res.tempFiles.length; i++) {
            that.checkImg(res.tempFilePaths[i])
          }
        }
        else {
          wx.showToast({
            title: '选择图片过多',
            icon: "error",
          })
        }
      },
    });
  },
  //预览图片
  previewImage(e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files, // 需要预览的图片http链接列表
    });
  },
  //长按删除
  deleteImage(e) {
    var index = e.currentTarget.dataset.index;
    var files = this.data.files;
    files.splice(index, 1);
    this.setData({
      files,
      imgNum: this.data.imgNum - 1
    })
  },
  getImgName(e) {
    var nowdate = new Date();
    var year = nowdate.getFullYear(),
      month = nowdate.getMonth() + 1,
      date = nowdate.getDate(),
      h = nowdate.getHours(),
      m = nowdate.getMinutes(),
      s = nowdate.getSeconds(),
      ms = nowdate.getMilliseconds(),
      month = this.checkTime(month),
      date = this.checkTime(date),
      h = this.checkTime(h),
      m = this.checkTime(m),
      s = this.checkTime(s),
      ms = this.checkTime(ms);
    return '' + year + month + date + h + m + s + ms;
  },
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  bindCampusChange(e) {
    this.setData({
      campusIndex: e.detail.value,
    });
  },
  bindCategoryChange(e) {
    this.setData({
      categoryIndex: e.detail.value,
    });
  },
  //发布
  async bindSubmitBook(e) {
    var valid = this.data.titleValid && this.data.contentValid;
    var complete=this.data.title && this.data.content && this.data.contact && (this.data.wechat || this.data.QQ || this.data.tel)
    if (valid && complete) {
      wx.showLoading({
        title: '发布中',
      })
      await this.uploadImg();
      wx.hideLoading()
      this.uploadPost();
    }
    else if (!complete) {
      wx.showToast({
        title: '信息填写不完整',
        icon: "error"
      })
    }
    else {
      wx.showToast({
        title: '标题或内容违规',
        icon: "error"
      })
    }
  },
  //上传图片返回fileID
  async uploadImg() {
    for (var i = 0; i < this.data.imgNum; i++) {
      var imgName = this.getImgName() + 'jpg';
      await wx.cloud.uploadFile({
        cloudPath: imgName,
        filePath: this.data.files[i],
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        }
      }).then(res => {
        this.setData({
          imgSrc: this.data.imgSrc.concat(res.fileID),
        })
        console.log('上传成功');
      }).catch((e) => {
        console.log(e);
      });
    }
  },
  uploadPost() {
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
    var postTime = '' + year + '/' + month + '/' + date + ' ' + h + ':' + m;
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'addPost',
        title: this.data.title,
        content: this.data.content,
        imgURL: this.data.imgSrc,
        campus: this.data.campusList[this.data.campusIndex],
        category: this.data.categoryList[this.data.categoryIndex],
        contact: this.data.contact,
        postTime: postTime,
        zhidingTime: Date.parse(new Date()),
        contactInfo: [["微信", this.data.wechat], ["QQ", this.data.QQ], ["电话", this.data.tel]]
      }
    }).then((resp) => {
      wx.showToast({
        title: '发布成功',
      })
      this.sleep(1000);
      wx.reLaunch({
        url: '../index/index',
      })
      this.getReBang();
    }).catch((e) => {
      console.log(e);
      wx.showToast({
        title: '发布失败',
        icon: "error"
      })
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
  onShow: function () {
    this.setData({
      record: wx.getStorageSync('record'),
      hasUserInfo: wx.getStorageSync('hasUserInfo')
    })
    this.setData({
      contact: this.data.record.contact,
      wechat: this.data.record.wechat,
      QQ: this.data.record.QQ,
      tel: this.data.record.tel
    })
    //定时获取消息数量并提示
    this.setData({
      intervalNumber: setInterval(this.getMsgNum, 1000)
    })
    //获取token并验证是否过期
    var that = this;
    wx.getStorage({
      key: 'expires_in',
      success(res) {
        // 获取成功，证明本地已存有相关token
        const newT = new Date().getTime();
        //用当前时间和存储的时间判断，token是否已过期
        if (newT > parseInt(res.data)) {
          // token过期，重新获取token
          that.getToken();
        } else {
          // 获取本地缓存的token
          let token = wx.getStorageSync('access_token');
          that.setData({ token: token });
        }
      }, fail() {
        that.getToken();
      }
    });
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
  //检测标题文本
  checkTitle(e) {
    if (this.data.title != "") {
      this.checkText("title", this.data.title);
    }
  },
  //检测内容文本
  checkContent(e) {
    if (this.data.content != "") {
      this.checkText("content", this.data.content);
    }
  },
  checkText(type, text) {
    var that = this;
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/solution/v1/text_censor/v2/user_defined?access_token=' + this.data.token,
      data: {
        text: text
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success(res) {
        if (res.data.conclusion == "合规") {
          if (type == "title") {
            that.setData({ titleValid: true })
          }
          else {
            that.setData({ contentValid: true })
          }
        }
        else {
          if (type == "title") {
            that.setData({
              errorMsg: "标题" + res.data.data[0].msg + ",请修改",
              topTips: true,
              titleValid: false,
            })
            setTimeout(() => {
              that.setData({
                topTips: false,
              });
            }, 3000);
          }
          else {
            that.setData({
              errorMsg: "内容" + res.data.data[0].msg + ",请修改",
              topTips: true,
              contentValid: false,
            })
            setTimeout(() => {
              that.setData({
                topTips: false,
              });
            }, 3000);
          }
        }
      },
      fail: () => {
        that.setData({
          errorMsg: "检测失败，请重试",
          topTips: true,
        })
        setTimeout(() => {
          that.setData({
            topTips: false,
          });
        }, 3000);
      }
    })
  },
  checkImg(file) {
    var that = this;
    wx.getFileSystemManager().readFile({
      filePath: file,
      encoding: 'base64',
      success: res => {
        var image = res.data;
        wx.request({
          url: 'https://aip.baidubce.com/rest/2.0/solution/v1/img_censor/v2/user_defined?access_token=' + this.data.token,
          data: {
            image: image
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success(res) {
            if (res.data.conclusion == "不合规") {
              that.setData({
                topTips: true,
                errorMsg: "图片" + res.data.data[0].msg + ",请重新选择"
              })
              setTimeout(() => {
                that.setData({
                  topTips: false,
                });
              }, 3000);
            }
            else {
              that.setData({
                files: that.data.files.concat(file),
                imgNum: that.data.imgNum + 1,
              });
            }
          },
          fail: () => {
            that.setData({
              topTips: ture,
              errorMsg: "图片检测失败，请重试",
            });
            setTimeout(() => {
              that.setData({
                topTips: false,
              });
            }, 3000);
            return false;
          }
        })
      }
    })
  },
  // 获取token
  getToken: function () {
    var that = this;
    var client_id = "MPI8DV8Wxa9lh4R7gjnGSrjs";
    var client_secret = "BEmGgC8j24OPbIafYQsmvdCMcLATupfD";
    const url = 'https://aip.baidubce.com/oauth/2.0/token' +
      '?grant_type=client_credentials' +
      '&client_id=' + client_id + '&client_secret=' + client_secret;
    wx.request({
      url: url,
      method: 'POST',
      success: res => {
        console.log(res)
        let thaRres = res.data;
        // 将access_token存储到storage中
        wx.setStorage({
          key: 'access_token',
          data: thaRres.access_token
        });
        var date = new Date().getTime();
        let time = date + 2592000 * 1000;
        console.log('三十天后的时间', time);
        console.log('当前时间戳', date)
        wx.setStorage({
          key: 'expires_in',
          data: time
        });
        that.setData({ token: thaRres.access_token });
      },
      fail: () => { }
    });
  },
  async getReBang(e) {
    await this.getHeatData();
    this.countHeat();
    this.sort();
    this.setMsg();
  },
  //获取所有数据
  async getHeatData(e) {
    //所有帖子
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getPost',
        campus: "全部",
        category: "全部",
        zhiding: '',
      }
    }).then(resp => {
      this.setData({
        postList_rb: resp.result.data
      })
    })

    var tmpVisit = [];
    var tmpTalks = [];
    var tmpContent = [];
    var tmpTime = [];
    var tmpDianzan = [];
    var tmpShoucang = [];
    for (var i = 0; i < this.data.postList_rb.length; i++) {
      //浏览数量
      await wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'getCount',
          postId: this.data.postList_rb[i].postId,
          name: '获取浏览数'
        }
      }).then(resp => {
        if (resp.result.data[0].visit > 100) {
          tmpVisit = tmpVisit.concat("100")
        }
        else {
          tmpVisit = tmpVisit.concat(resp.result.data[0].visit)
        }
      })
      //评论数量
      await wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'getCount',
          postId: this.data.postList_rb[i].postId,
          name: '获取评论数'
        }
      }).then(resp => {
        if (resp.result.list.length != 0) {
          if (resp.result.list[0].talksNum > 100) {
            tmpTalks = tmpTalks.concat("100")
          }
          else {
            tmpTalks = tmpTalks.concat(resp.result.list[0].talksNum)
          }
        }
        else {
          tmpTalks = tmpTalks.concat("0")
        }
      })
      //帖子内容
      if (this.data.postList_rb[i].content.length > 100) {
        tmpContent = tmpContent.concat("100");
      }
      else {
        tmpContent = tmpContent.concat(this.data.postList_rb[i].content.length);
      }
      //发布时间到现在的时间戳
      tmpTime = tmpTime.concat(Date.parse(new Date()) - Date.parse(this.data.postList_rb[i].postDate));
      //点赞数量
      await wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'getCount',
          name: '获取点赞数',
          postId: this.data.postList_rb[i].postId,
        }
      }).then(resp => {
        if (resp.result.list.length != 0) {
          tmpDianzan = tmpDianzan.concat(resp.result.list[0].dianzanNum)
        }
        else {
          tmpDianzan = tmpDianzan.concat("0")
        }
      })
      //收藏数量
      await wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'getCount',
          name: '获取收藏数',
          postId: this.data.postList_rb[i].postId,
        }
      }).then(resp => {
        if (resp.result.list.length != 0) {
          tmpShoucang = tmpShoucang.concat(resp.result.list[0].shoucangNum)
        }
        else {
          tmpShoucang = tmpShoucang.concat("0")
        }
      })
    }
    this.setData({
      visit: tmpVisit,
      talks: tmpTalks,
      contentNum: tmpContent,
      time: tmpTime,
      dianzan: tmpDianzan,
      shoucang: tmpShoucang,
    })
  },
  //计算热度
  countHeat(e) {
    for (var i = 0; i < this.data.postList_rb.length; i++) {
      console.log(this.data.visit[i] * 0.6 + this.data.talks[i] * 0.9 + this.data.contentNum[i] * 0.5 - 0.8 * this.data.time[i] / (60 * 1000 * 5) + this.data.dianzan[i] * 1 + this.data.shoucang[i] * 1)
      this.setData({
        heatNum: this.data.heatNum.concat(this.data.visit[i] * 0.6 + this.data.talks[i] * 0.9 + this.data.contentNum[i] * 0.5 - 0.8 * this.data.time[i] / (60 * 1000 * 5) + this.data.dianzan[i] * 1 + this.data.shoucang[i] * 1)
      })
    }
  },
  //排序
  sort(e) {
    var tmpheatNum = this.data.heatNum;
    var tmpheatIndex = [];
    for (var i = 0; i < tmpheatNum.length; i++) {
      tmpheatIndex = tmpheatIndex.concat(i)
    }
    for (var i = 0; i < tmpheatNum.length - 1; i++) {
      var k = i;
      for (var j = i + 1; j < tmpheatNum.length; j++) {
        if (tmpheatNum[k] < tmpheatNum[j]) {
          var t = tmpheatNum[k];
          tmpheatNum[k] = tmpheatNum[j];
          tmpheatNum[j] = t;

          var t = tmpheatIndex[k];
          tmpheatIndex[k] = tmpheatIndex[j];
          tmpheatIndex[j] = t
        }
      }
    }
    if (tmpheatIndex.length > 5) {
      for (var i = 0; i < 5; i++) {
        this.setData({ heatIndex: this.data.heatIndex.concat(tmpheatIndex[i]) })
      }
    }
    else{
      this.setData({ heatIndex: tmpheatIndex})
    }
    console.log(this.data.heatIndex)
  },
  //储存热帖
  setMsg(e) {
    for (var i = 0; i < this.data.heatIndex.length; i++) {
      this.data.tmpPost = this.data.postList_rb[this.data.heatIndex[i]];
      this.setData({
        "tmpPost.heat": this.data.heatNum[i],
        "tmpPost.mark": "1",
        "tmpPost.rank":i,
        rebangPost: this.data.rebangPost.concat(this.data.tmpPost),
      })
    }
    console.log(this.data.rebangPost)
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'dealReBang',
        name: '更新热榜',
        data: this.data.rebangPost,
      }
    })
  }
})