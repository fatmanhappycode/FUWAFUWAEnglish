let plugin = requirePlugin("myPlugin");
let manager = plugin.getSoeRecorderManager({
  secretId: 'AKIDhky3NZGAvsg0EJmxx1xmR2ticVQCAIhx',
  secretKey: 'MfrwqZDi4K3d5VoBTgonfvEPWbO4RgIi'
});
Page({
  data:{
    searchTitle:"",
    translateTitle:"", // 翻译后的内容，音标或者翻译
    lang:"",
    vUrl:"", // 要播放视频的url
    list:[{
      image:"../../img/avtar.jpg",
      sSubtitleZh:'这里',
      sSubtitleEn:'here',
      vName:"",
      sTime:"", // 播放时间点
      vEpisode:"" // 播放集数
    }],
    showStatus:"",
    showWay:"showChoose",
    hideWay:"hideChoose",
    getImg:false,
    getVideo:false,
    imgIndex:0,
    isRecord:false,
    scoreShow:false,
    scoreComment:"", // 对分数进行评价
    score:0,
    recordStatus: "正在录音", // 录音状态
    recodePath: "", // 录音存放路径
    frontImg:"", // 三帧图片的第一张
    behindImg: "", // 三帧图片的最后一张
    hasNextPage: false,
    hasPreviousPage: false,
    pageNum: 1,
    getTop:'',
    navigatepageNums: [],
    aniFlag:[false,false,false,false,false,false,false,false,false]
  },
  //点击跳出图片和视频图标提供选择
  chooseWay:function(event){
    let index = event.currentTarget.dataset.testid;
    let aniFlag=this.data.aniFlag;
    aniFlag[index]=true
    this.setData({
      showStatus:this.data.showWay,
      aniFlag: aniFlag
    })
  },
  //再点一次关闭图片和视频图标选择
  hideWay: function () {
    this.setData({
      showStatus: this.data.hideWay
    });
    let that=this;
    setTimeout(function(){
      that.setData({
        aniFlag: [false, false, false, false, false, false, false, false, false]
      })
    },500)
  },
  //让每帧图片窗口跳出
  getPerImg: function (event) {
    let index = event.currentTarget.dataset.testid
    let top=200+260*parseInt(index+1);
    this.setData({
      getTop:top,
      aniFlag: [false, false, false, false, false, false, false, false, false]
    })
    
    let list =this.data.list.result[index];
    let img=list.image;
    let imgArr=img.split('/');
    let num=imgArr[imgArr.length-1].split('.');
    imgArr[imgArr.length-1]=(parseInt(num[0])-1)+'.'+num[1]
    let fImg=imgArr.join('/');
    imgArr[imgArr.length - 1] = (parseInt(num[0]) + 1) + '.' + num[1]
    let bImg = imgArr.join('/');
    this.setData({
      getImg: true,
      frontImg:fImg,
      behindImg:bImg,
      imgIndex: index
    });
    this.goScrolltop();
  }, 
  //让视频窗口跳出
  getRealVideo: function (event) {
    var list = event.currentTarget.dataset.testid
    this.setData({
      getVideo: true
    })
    let that=this;
    wx.request({
      url: 'https://www.subtitlesearch.xyz/getVideo',
      data: `vName=${list.vName}&time=${list.sTime}`,
      success: function (res) {
        console.log(res);
        that.setData({
          vUrl:res.data.extend.result
        })
      }
    });

  },
  //关闭跳出来的窗口
  closeWindow:function(){
    let flag=false;
    if(this.data.getImg){
      flag=true;
    }
    this.setData({
      getImg:false,
      getVideo: false,
      scoreShow:false
    })
    if(flag){
      console.log(this.data.getTop); 
      wx.pageScrollTo({
        scrollTop: this.data.getTop,
        duration: 0
      })
    }
  },
  //上一页
  lastPage: function () {
    var language;
    if (this.data.languageBtn = '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    //对搜索对应内容的请求
    this.requestByPost(this.data.pageNum - 1);
    this.goScrolltop();
  },
  //下一页
  nextPage: function () {
    var language;
    if (this.data.languageBtn = '英语') {
      language = "En"
    } else {
      language = "Zh"
    }
    //对搜索对应内容的请求
    this.requestByPost(this.data.pageNum + 1);
    this.goScrolltop();
  },
  //跳转到某一页
  toPage: function (event) {
    var item = event.currentTarget.dataset.testid;
    this.requestByPost(item);
    this.goScrolltop();
  },
  //回到顶部
  goScrolltop: function (e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
    },
  //开始录音
  startRecord: function (event) {
    this.setData({
      isRecord: true,
      recordStatus: "正在录音"
    })
    let content = event.currentTarget.dataset.testid;
    console.log('content   :    '+content)
    manager.start({
      content: content,
      evalMode: 1
    });
  },
  // 结束录音
  endRecord: function () {
    manager.stop();
    let that=this;
    setTimeout(function () {
      that.setData({
        isRecord: false,
        scoreShow: true
      })
      this.commentScore()
    },700)
  },
  // 评价分数
  commentScore:function(){
    var score=this.data.score
    var commend=""
    if(score<60){
      commend="你说什么风太大我听不清"
    }
    else if(score>=60&&score<80){
      commend="你的中文发音挺好"
    }
    else if(score>=80&&score<90){
      commend="你是不是很有钱经常去美国"
    }
    else{
      commend="你是假的中国人吧"
    }
    this.setData({
      scoreComment:commend
    })
  },
  // 单词请求音标
  wordsRequest: function (word){
    let that = this;
    console.log('danci');
    wx.vrequest({
      url: 'http://dict-co.iciba.com/api/dictionary.php?key=32B25A29CBE2D70D4E1DA12036763605',
      method: 'POST',
      dataType: 'json',
      data: 'type=json&w=' + word ,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          translateTitle:res.data.symbols[0].ph_en
        })
      }
    })
  },
  //句子请求翻译
  sentenceRequest: function (str){
    let that=this;
    console.log('juzi');
    wx.vrequest({
      url: 'http://fanyi.youdao.com/translate',
      method: 'POST',
      dataType: 'json',
      data: 'doctype=json&type=AUTO&i=' + str,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          translateTitle: res.data.translateResult[0][0].tgt
        })
      }
    })
  },
  //请求页面数据
  requestByPost: function (pn) {
    let that = this;
    let data = `searchTitle=${this.data.searchTitle}&pn=${pn}&vName=${this.data.vName}&lang=${this.data.lang}`;
    this.setData({
      pageNum:pn
    });
    //使用上个页面传过来的搜索字符串进行请求
    wx.request({
      url: 'https://www.subtitlesearch.xyz/subtitles',
      data: data,
      success: function (res) {
        console.log(res)
        res = res.data.extend.result;
        that.setData({
          list: res.list,
          hasNextPage: res.hasNextPage,
          hasPreviousPage: res.hasPreviousPage,
          pageNum: res.pageNum,
          navigatepageNums: res.navigatepageNums
        })

      }
    });
  },
  onLoad: function (options) {
    let that=this;
    manager.onSuccess((res) => {
      //打印识别结果
      console.log(res);
      that.setData({
        score: res.SuggestedScore
      })
    });

    this.setData({
      vName:options.vName,
      lang:options.lang,
      searchTitle:options.searchTitle,
    })
    //请求数据
    this.requestByPost(1);
    if(options.lang=='En'){
      //判断为单词还是句子
      let str = options.searchTitle.trim();
      if (str.replace(/^[A-Za-z]+$/, "")=="")// 为单词
        this.wordsRequest(str);
      else
        this.sentenceRequest(str);
    }
  }
})