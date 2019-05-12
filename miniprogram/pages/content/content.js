// let plugin = requirePlugin("myPlugin");
// let manager = plugin.getSoeRecorderManager({
//   secretId: 'AKIDhky3NZGAvsg0EJmxx1xmR2ticVQCAIhx',
//   secretKey: 'MfrwqZDi4K3d5VoBTgonfvEPWbO4RgIi'
// });
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
    isRecord:false,
    scoreShow:false,
    scoreComment:"", // 对分数进行评价
    score:0,
    recordStatus: "正在录音", // 录音状态
    recodePath: "", // 录音存放路径
    frontImg:"", // 三帧图片的第一张
    behindImg: "" // 三帧图片的最后一张
  },
  //点击跳出图片和视频图标提供选择
  chooseWay:function(){
    this.setData({
      showStatus:this.data.showWay
    })
  },
  //再点一次关闭图片和视频图标选择
  hideWay: function () {
    this.setData({
      showStatus: this.data.hideWay
    })
  },
  //让每帧图片窗口跳出
  getPerImg:function(){
    var list = event.currentTarget.dataset.testid;
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
      behindImg:bImg
    })
  }, 
  //让视频窗口跳出
  getRealVideo: function (event) {
    var list = event.currentTarget.dataset.testid
    this.setData({
      getVideo: true
    })
    wx.request({
      url: '',
      method:'post',
      dataType:'json',
      data:{
        vName:list.vName,
        time:list.sTime
      },
      success: function (res) {
        this.setData({
          vUrl:res.extend.result
        })
      }
    })
  },
  //关闭跳出来的窗口
  closeWindow:function(){
    this.setData({
      getImg:false,
      getVideo: false,
      scoreShow:false
    })
  },
  //开始录音
  startRecord: function () {
    var that = this; // 存储this
    this.setData({
      isRecord: true,
      recordStatus: "正在录音"
    })
    wx.startRecord({
      success: function (res) {
        res = res.extend.result
        var tempFilePath = res.tempFilePath
        that.setData({
          recodePath: tempFilePath
        })
      },
      fail: function (res) {
        console.log('fail')
        console.log(res)
      }
    })
  },
  // 上传录音
  uploadRecord: function (event) {
    var sentence = event.currentTarget.dataset.testid // 要测试的英文句子
    this.setData({
      recordStatus:"录音上传中"
    })
    var that=this;

    wx.uploadFile({
      url: '',
      filePath: 'that.data.recodePath',
      name: 'file',
      data:{
        message: sentence
      },
      success: function (res) {
        res = res.extend.result

        that.endRecord()
      },
      fail:function(){
        console.log('fail')
        that.setData({
          recordStatus: "录音上传失败"
        })
        that.endRecord()
      }
    })
  },
  // 结束录音
  endRecord: function () {
    setTimeout(()=>{
      this.setData({
        isRecord: false,
        scoreShow:true
      })
      this.commentScore()
    },500)
    wx.stopRecord()
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
    wx.request({
      url: 'http://dict-co.iciba.com/api/dictionary.php?w='+word+'&type=json&key=32B25A29CBE2D70D4E1DA12036763605',
      data: '',
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        this.setData({
          translateTitle:res.ph_en
        })
      }
    })
  },
  //句子请求翻译
  sentenceRequest: function (str){
    wx.request({
      url: 'url:http://fanyi.baidu.com/transapi?from=auto&to=cht&query='+str,
      data: '',
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        this.setData({
          translateTitle: res.data.dst
        })
       }
    })
  },
  onLoad:function(options){
    this.setData({
      vName:options.vName,
      lang:options.lang,
      searchTitle:options.searchTitle
    })
    //使用上个页面传过来的搜索字符串进行请求
    wx.request({
      url: "",
      data: {
        searchTitle: options.searchTitle,
        lang: options.lang,
        vName:options.vName
      },
      success: function (res) {
        res = res.extend.result
        this.setData({
          list:res.list,
        })
      }
    })
    //判断为单词还是句子
    let str = options.searchTitle.trim();
    if (str.replace(/^[A-Za-z]+$/, "")=="")// 为单词
      this.wordsRequest(str);
    else
      this.sentenceRequest(str);
  }
})