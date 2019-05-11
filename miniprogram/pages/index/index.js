//index.js
const app = getApp()
let plugin = requirePlugin("myPlugin");
let manager = plugin.getSoeRecorderManager({
  secretId: 'AKIDhky3NZGAvsg0EJmxx1xmR2ticVQCAIhx',
  secretKey: 'MfrwqZDi4K3d5VoBTgonfvEPWbO4RgIi'
});

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    manager.onSuccess((res) => {
      //打印识别结果
      console.log(res);
    });
    manager.onError((res) => {
      console.log(res)
    });
    wx.vrequest({
      url: 'http://47.101.58.51:8080/getVideo',
      method: 'POST',
      dataType: 'json',
      data: 'vName=狮子王&time=00:00:50',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
      }
    });

    wx.vrequest({
      url: 'http://47.101.58.51:8080/subtitles',
      method: 'POST',
      dataType: 'json',
      data: 'searchTitle=我&pn=1&vName=狮子王&lang=Zh',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
      }
    });
    wx.vrequest({
      url: 'http://47.101.58.51:8080/videos',
      method: 'POST',
      dataType: 'json',
      data: 'searchTitle=你妈的&pn=1&lang=Zh&videoType=',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
      }
    });

    wx.vrequest({
      url: 'http://47.101.58.51:8080/getHint',
      method: 'POST',
      dataType: 'json',
      data: 'searchTitle=我一会&lang=Zh',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
      }
    });
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    manager.start({
      content: 'you jump, i jump',
      evalMode:1
    });
  },

  stop:function() {
    manager.stop();
  },
  result: function() {
    console.log("1");
  }
});
