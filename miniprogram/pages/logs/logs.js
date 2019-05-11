//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    searchTip:'输入你想到的台词',
    typeList:['无','剧情','爱情','动作','科幻','悬疑','惊悚'],
    languageList:['英语','中文'],
    typeShow:false,
    languageShow:false,
    typeBtn:"影片类型",
    languageBtn:"英语",
    inputStatus:"input-down",
    searchWord:"",
    isSearch:false, // 是否已经按下搜索
    count:0,
    page:1,
    totalPage:1,
    list:{"result":[
      {
      movieName: ['myavter'],
      movieImg: ['../../img/avtar.jpg'],
    }
    ]
    },
    previousPageClass:"page-btn",
    nextPageClass:"page-btn",
    navigatepageNums:[1,2,3,4,5]
  },
  //显示下拉
  showType:function(){
    this.setData({
      typeShow: true,
      languageShow: false,
      inputStatus: "input-down"
    })
  },
  showLanguage:function(){
    this.setData({
      languageShow: true,
      typeShow: false,
      inputStatus: "input-down"
    })
  },
  //隐藏下拉
  hideList:function(){
    this.setData({
      typeShow:false,
      languageShow: false,
      inputStatus: "input-up"
    })
  },
  //改变按钮名称
  typeChange: function (event) {
    var content = event.currentTarget.dataset.testid;
    this.setData({
      typeBtn: content,
      typeShow: false
    })
  },
  languageChange:function(event){
    var content = event.currentTarget.dataset.testid;
    this.setData({
      languageBtn: content,
      languageShow: false
    })
  },
  //监听输入内容
  inputStr:function(e){
    this.setData({
      searchWord:e.detail.value
    })
  },
  //搜索电影
  searchMovie:function(){
    //判断是否为空
    if(this.data.searchWord===""){
      this.setData({
        searchTip:'不能搜索空内容'
      })
    }
    else{
        //标记为当前是搜索状态
        this.setData({
          isSearch:true
        })
        var language;
        if (this.data.languageBtn='英语'){
          language="En"
        }else{
          language="Zh"
        }
        //对搜索对应内容的请求
        wx.request({
          url:"",
          data:{
            searchTitle: this.data.searchWord,
            pn: this.data.page,
            lange: language
          },
          success: function (res) {
            res = res.extend.result
            this.setData({
              page:res.extend.result.pageNum,
              totalPage:res.pages,
              count:res.total,
              previousPageClass: res.hasPreviousPage ? "page-btn" : "page-btn no-page",
              nextPageClass: res.hasNextPage ? "page-btn" : "page-btn no-page",
              navigatepageNums: res.navigatepageNums,
              list:res.list
            })
          }
        })
    }
  },
  //上一页
  lastPage:function(){
    var language;
    if (this.data.languageBtn = '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    //对搜索对应内容的请求
    wx.request({
      url: "",
      data: {
        searchTitle: this.data.searchWord,
        pn: this.data.page-1,
        lange: language
      },
      success: function (res) {
        res = res.extend.result
        this.setData({
          page: res.pageNum,
          totalPage: res.pages,
          count: res.total,
          previousPageClass: res.hasPreviousPage ? "page-btn" : "page-btn no-page",
          nextPageClass: res.hasNextPage ? "page-btn" : "page-btn no-page",
          navigatepageNums: res.navigatepageNums,
          list: res.list
        })
      }
    })
  },
  //下一页
  nextPage:function(){
    var language;
    if (this.data.languageBtn = '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    //对搜索对应内容的请求
    wx.request({
      url: "",
      data: {
        searchTitle: this.data.searchWord,
        pn: this.data.page + 1,
        lange: language
      },
      success: function (res) {
        res=res.extend.result
        this.setData({
          page: res.pageNum,
          totalPage: res.pages,
          count: res.total,
          previousPageClass: res.hasPreviousPage ? "page-btn" : "page-btn no-page",
          nextPageClass: res.hasNextPage ? "page-btn" : "page-btn no-page",
          navigatepageNums: res.navigatepageNums,
          list: res.list
        })
      }
    })
  },
  //跳转到某一页
  toPage:function(event){
    var item = event.currentTarget.dataset.testid;
    wx.request({
      url:"",
      data: {
        searchTitle: this.data.searchWord,
        pageNum: item,
        lange: language
      },
      success:function(res){
        res = res.extend.result
        this.setData({
          page: res.pageNum,
          totalPage: res.pages,
          count: res.total,
          previousPageClass: res.hasPreviousPage ? "page-btn" : "page-btn no-page",
          nextPageClass: res.hasNextPage ? "page-btn" : "page-btn no-page",
          navigatepageNums: res.navigatepageNums,
          list: res.list
        })
      }
    })
  },
  //点击电影查看具体内容
  concreteContent: function (event) {
    var content = event.currentTarget.dataset.testid;
    var language;
    if (this.data.languageBtn = '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    wx.navigateTo({
      url: '../content/content?searchTitle=' + this.data.searchWord + "&vName=" + this.data.content + "&lang=" + language,
    })
  },
  onLoad: function () {
  }
})
