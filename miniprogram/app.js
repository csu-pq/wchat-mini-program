App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }
    
    wx.cloud.callFunction({
      name:'myFunctions',
      config:{
        env:'cloud1-5gkp8gvb02539afe'
      },
      data:{
        type:'getOpenId'
      }
    }).then((resp)=>{
      wx.setStorageSync('openId', resp.result.openid)
    })
    this.globalData = {};
  },
});
