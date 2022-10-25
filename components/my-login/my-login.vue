<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="150" color="#AFAFAF" class="icon"></uni-icons>
    <!-- 为登录的 button 按钮绑定 open-type="getUserInfo" 属性，表示点击按钮时，希望获取
用户的基本信息： -->
    <!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 open-type="getUserInfo" @getuserinfo="getUserInfo"-->
    <button type="primary" class="btn-login" @click="getUserProfile"  >一键登录</button>
    <text class="text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import{ mapMutations,mapState} from "vuex"
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    computed: {
     ...mapState("m_user",["redirectInfo"])
    },
    methods: {
      // 从store中获取更新用户的方法并保存在store
      ...mapMutations('m_user',['updateUserInfo','updateToken',"updateRedirectInfo"]),
      // // 获取微信用户的基本信息
//       getUserInfo(e) {
//         // // 判断是否获取用户信息成功
//         if(e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg("您取消了登录授权")
//         // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
//         console.log(e.detail)
//         // // 3. 将用户的基本信息存储到 vuex 中
//         this.updateUserInfo(e.detail.userInfo)
//         // 当获取到了微信用户的基本信息之后，还需要进一步调用登录相关的接口，从而换取
// // 登录成功之后的 Token 字符串。
//           // 获取登录成功后的 Token 字符串
//           this.getToken(e.detail)
//       },
           async getUserProfile(){
            const [err,succ]=await uni.getUserProfile({ desc:'保存用户信息'})
             // console.log(err,succ);
            if(err&&succ.errMsg!=="getUserProfile:ok")return uni.$showMsg("您拒绝了获取用户信息")
              // 将用户的基本信息存储到 vuex 中
               this.updateUserInfo(succ.userInfo)
               // console.log(succ.userInfo);
               // 获取登录成功后的 Token 字符串
               this.getToken(succ)
             
           },
      // // 调用登录接口，换取永久的 token
       async getToken(info){
        // // 调用微信登录接口
         const [err, res] = await uni.login().catch(err => err)
         // console.log(res);
         // console.log(info)
         // 判断是否 wx.login() 调用失败
         if(err||res.errMsg!=="login:ok")return uni.$showError('登录失败！')
         // 准备参数对象
         const query={
           code: res.code,
           encryptedData: info.encryptedData,
           iv: info.iv,
           rawData: info.rawData,
           signature: info.signature
         }
         // 换取 token
         // const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)   
         const loginResult={
  "message": {
    "user_id": 23,
    "user_email_code": null,
    "is_active": null,
    "user_sex": "男",
    "user_qq": "",
    "user_tel": "",
    "user_xueli": "本科",
    "user_hobby": "",
    "user_introduce": null,
    "create_time": 1562221487,
    "update_time": 1562221487,
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
  },
  "meta": {
    "msg": "登录成功",
    "status": 200
  }
}
         // console.log(res1);
         // console.log(loginResult);
         if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
         uni.$showMsg('登录成功')
         this.updateToken(loginResult.message.token)
         // this.updateToken(res.code)
         // // 判断 vuex 中的 redirectInfo 是否为 null
// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
         // 预调用this.navigateBack() 方法返回登录之前的页面：
         this.navigateBack()
      },
      // 返回登录之前的页面
       navigateBack(){
         // redirectInfo 不为 null，并且导航方式为 switchTab
         if(this.redirectInfo &&this.redirectInfo.openType === 'switchTab'){
           // 调用小程序提供的 uni.switchTab() API 进行页面的导航
           uni.switchTab({
             // 要导航到的页面地址
             url: this.redirectInfo.from,
             // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
             complete: () => {
               this.updateRedirectInfo(null)
             }
           })
         }
       }
      
    },
  }
</script>

<style lang="scss">
.login-container{
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
  // 绘制登录盒子底部的半椭圆造型
  &::after {
  content: ' ';
  display: block;
  position: absolute;
  width: 100%;
  height: 40px;
  left: 0;
  bottom: 0;
  background-color: white;
  border-radius: 100%;
  transform: translateY(50%);
  }
  .btn-login{
    background-color: #c00000;
    width: 90%;
    border-radius: 100px;
    margin: 30rpx 0;
  }
  .text{
    font-size: 24rpx;
   
    color:#AFAFAF ;
  }
}
</style>