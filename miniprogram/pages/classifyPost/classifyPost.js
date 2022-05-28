Page({
  data: {
    //校区
    campusList: ["全部","铁道校区", "新校区", "南校区", "校本部", "湘雅校区"],
    campusIndex: 0,
    //帖子类型
    categoryList: ["全部","二手闲置", "打听求助", "组队交友", "爱心公益"],
    categoryIndex: 0,

    postList:{},
    postList_zhiding:{},
  },
  categoryChange(e){
    this.setData({
      categoryIndex: e.detail.value,
    });
    this.resultRefresh(this.data.categoryList[this.data.categoryIndex],this.data.campusList[this.data.campusIndex]);
  },
  campusChange(e){
    this.setData({
      campusIndex: e.detail.value,
    });
    this.resultRefresh(this.data.categoryList[this.data.categoryIndex],this.data.campusList[this.data.campusIndex]);
  },
  resultRefresh(category,campus){
    //获取置顶的
    wx.cloud.callFunction({
      name:'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data:{
        type:'getPost',
        category:category,
        campus:campus,
        zhiding:"置顶"
      }
    }).then(resp => {
      console.log(resp)
      this.setData({
        postList_zhiding:resp.result.data
      })
    }).catch((e) => {
      console.log(e);
    });
    //获取未置顶的
    wx.cloud.callFunction({
      name:'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data:{
        type:'getPost',
        category:category,
        campus:campus,
        zhiding:"未置顶"
      }
    }).then(resp => {
      this.setData({
        postList:resp.result.data
      })
    }).catch((e) => {
      console.log(e);
    });
  },
  showPostInfo(e){
    wx.navigateTo({
      url: '../showPost/showPost?postId='+e.currentTarget.id,
    })
  },
  onLoad: function (options) {
    if(options.category){
      if(options.category=="二手闲置"){
        this.setData({categoryIndex:1})
      }
      else if(options.category=="打听求助"){
        this.setData({categoryIndex:2})
      }
      else if(options.category=="组队交友"){
        this.setData({categoryIndex:3})
      }
      else{
        this.setData({categoryIndex:4})
      }
    }
    if(options.campus){
      if(options.campus=="铁道校区"){
        this.setData({campusIndex:1})
      }
      else if(options.campus=="新校区"){
        this.setData({campusIndex:2})
      }
      else if(options.campus=="南校区"){
        this.setData({campusIndex:3})
      }
      else if(options.campus=="校本部"){
        this.setData({campusIndex:4})
      }
      else{
        this.setData({campusIndex:5})
      }
    }
  },
  onShow: function () {
    this.resultRefresh(this.data.categoryList[this.data.categoryIndex],this.data.campusList[this.data.campusIndex]);
  },
})