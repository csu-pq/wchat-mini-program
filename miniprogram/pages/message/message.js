Page({
  data: {
    hasUserInfo:false,
    msgList:[],
  },
  onShow: function () {
    this.setData({hasUserInfo:wx.getStorageSync('hasUserInfo')});
    //获取消息
    this.getMsg();
    //消息已读
    this.readMsg();
  },
  showPostInfo(e){
    if(e.currentTarget.id!=''){
      wx.navigateTo({
        url: '../showPost/showPost?postId='+e.currentTarget.id,
      })
    }
  },
  getMsg(e){
    wx.cloud.callFunction({
      name:'myFunctions',
      config:{
        env: "cloud1-5gkp8gvb02539afe"
      },
      data:{
        type:'getMsg',
        openId:wx.getStorageSync('openId')
      }
    }).then(resp=>{
      this.setData({
        msgList:resp.result.data
      })
    })
  },
  readMsg(e){
    wx.removeTabBarBadge({
      index: 3,
    })
    wx.cloud.callFunction({
      name:'myFunctions',
      config:{
        env: "cloud1-5gkp8gvb02539afe"
      },
      data:{
        type:'readMsg',
        openId:wx.getStorageSync('openId')
      }
    }).then(resp=>{
    })
  },
  onPullDownRefresh: function () {
    this.onShow();
  },
})