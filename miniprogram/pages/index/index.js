//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    testType:['恐怖', '搞笑', '科幻'],
    logs: [],
    searchTip:'输入你想到的台词',
    searchInfo:'正在搜索中',
    typeList:['无','剧情','爱情','动作','科幻','悬疑','惊悚'],
    languageList:['英语','中文'],
    typeShow:false,
    languageShow:false,
    typeBtn:"影片类型",
    languageBtn:"中文",
    inputStatus:"input-down",
    searchWord:"",
    isSearch:false, // 是否已经按下搜索
    count:0,
    page:1,
    totalPage:1,
    hasPreviousPage:false,
    hasNextPage:false,
    searchError:false,
    list:{},
    previousPageClass:"page-btn",
    nextPageClass:"page-btn",
    navigatepageNums:[],
    searching:false, // 是否显示搜索框
    searchChoose:[] // 搜索下拉可选内容
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
  //隐藏下拉和提示搜索
  hideList:function(){
    this.setData({
      typeShow:false,
      languageShow: false,
      inputStatus: "input-up",
      searching:false
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
    var language;
    if (this.data.languageBtn == '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    let that=this;
    wx.request({
      url: 'https://www.subtitlesearch.xyz/getHint',
      data: `searchTitle=${this.data.searchWord}&lang=${language}`,
      success: function (res) {
        console.log(res);
        that.setData({
          searchChoose:res.data.extend.result,
          searching:true
        })
      }
    });
  },
  // 按下提示搜索
  searchByTip:function(event){
    var word = event.currentTarget.dataset.testid;
    console.log(word);
    this.setData({
      searchWord: word,
      searching: false,
      isSearch:true
    })
    this.requestByPost(1);
  },
  //发起post请求
  requestByPost:function(page){
    // 重置内容
    this.setData({
      hasPreviousPage: false,
      hasNextPage: false,
      list:""
    })
    var language;
    if (this.data.languageBtn == '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    let that=this;
    let data = `searchTitle=${this.data.searchWord}&pn=${this.data.page}&lang=${language}&videoType=${this.data.typeBtn == "影片类型" ? "" : this.data.typeBtn}`
    console.log(data)
    wx.request({
      url: 'https://www.subtitlesearch.xyz/videos',
      data:{
        searchTitle: "我",
        lang: "Zh",
        videoType:"",
        pn:"1"
      },
      success: function (response) {
        console.log(response)
        let res = response.data.extend.result;
        that.setData({
          searchError: true,
          searchInfo: '正在搜索中...',
          list: res.list,
          navigatepageNums: res.navigatepageNums,
          hasNextPage: res.hasNextPage,
          hasPreviousPage: res.hasPreviousPage,
        })
        setTimeout(function () {
          console.log(res.total)
          if(res.total>0){
              that.setData({
                searchError: false
              })
          }else{
            that.setData({
              searchInfo: '没有搜索结果'
            })
            }
        }, 1000)
      }
    });
  },
  //搜索电影
  searchMovie:function(){
    //判断是否为空
    if(this.data.searchWord===""){
      this.setData({
        searchTip:'搜索内容不能为空'
      })
    }
    else{
      this.setData({
        isSearch: true
      })
      //对搜索对应内容的请求
      this.requestByPost(this.data.page);
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
    this.setData({
      page:this.data.page-1
    })
    //对搜索对应内容的请求
    this.requestByPost(this.data.page);
    this.goScrolltop();
  },
  //下一页
  nextPage:function(){
    var language;
    if (this.data.languageBtn = '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    this.setData({
      page: this.data.page + 1
    })
    //对搜索对应内容的请求
    this.requestByPost(this.data.page + 1);
    this.goScrolltop();
  },
  //跳转到某一页
  toPage:function(event){
    var item = event.currentTarget.dataset.testid;
    this.setData({
      page: item
    })
    this.requestByPost(item);
    this.goScrolltop();
  },
  //点击电影查看具体内容
  concreteContent: function (event) {
    var content = event.currentTarget.dataset.testid;
    var language;
    if (this.data.languageBtn == '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    let that=this
    wx.navigateTo({
      url: '../content/content?searchTitle=' + that.data.searchWord + "&vName=" + content + "&lang=" + language,
    })
  },
  onLoad: function () {
  }
})
