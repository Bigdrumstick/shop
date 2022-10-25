<template>
  <view>
    <!--  选择收货地址的盒子 --> 
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'" >
      <button type="primary" class="btn-address-choose" size="mini" @click="chooseAddress"> 请选择收货地址+
      </button>
    </view>
    <!-- 收货信息的盒子 -->
    <view class="address-info-box"  @click="chooseAddress" v-if="JSON.stringify(address) !== '{}'">
      <!-- 第一行 -->
      <view class="row1">
        <!-- 第一行左边 -->
        <view class="row1-left">
        <view class="username">收货人：<text>{{address.userName}}</text></view>
        </view>
        <view class="row1-right">
        <view class="phone">电话：<text>{{address.telNumber}}</text></view>
        <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <!-- 第二行 -->
      <view class="row2">
       <view class="row2-left">收货地址：</view>
       <view class="row2-right"> {{addstr}} </view>
      </view>
      
    </view>
    <view >
      <image src="../../static/cart_border@2x.png" class="address-bottom" ></image>
    </view>
  </view>
</template>

<script>
  import {mapState,mapGetters,mapMutations} from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {
         // 收货地址直接从仓库映射到本组件
         // address:{}
      };
    },
    computed: {
       ...mapState('m_user',['address']),
       ...mapGetters('m_user',['addstr']),
       // 收货详细地址的计算属性
       //  addstr() {
       //      if (!this.address.provinceName) return ''
       //      // 拼接 省，市，区，详细地址 的字符串并返回给用户
       //      return this.address.provinceName + this.address.cityName +
       //      this.address.countyName + this.address.detailInfo
       // }
      
    },
    methods:{
      // 从vuex映射得到的mutations里的方法
      ...mapMutations('m_user',['updateAddress']),
      // // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
// 返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
// 如果在选择收货地址的时候，用户点击了取消授权，则需要进行特殊的处理，否则用户将无法再
// 次选择收货地址！
      async chooseAddress(){
        // const res=await uni.chooseAddress()
        // console.log(res);
        const [ err,succ] = await uni.chooseAddress().catch(err=>err)
        // // // 2. 用户成功的选择了收货地址
        if(succ && succ.errMsg==='chooseAddress:ok'){
          // 为 data 里面的收货地址对象赋值
          //this.address = succ  //注释是因为可以直接调用mutations中的updateUserInfo方法，把成功的回调的数据保存到仓库
          // console.log(this.address);
         this.updateAddress(succ)
         // console.log(succ);
         // 如果用户没有授权
         // 问题说明：在 iPhone 设备上，当用户取消授权之后，再次点击选择收货地址按钮的时候，无法弹
        // 出授权的提示框！

    //  1. 导致问题的原因 - 用户取消授权后，再次点击 “选择收货地址” 按钮的时候：
    //     在模拟器和安卓真机上，错误消息 err.errMsg 的值为 chooseAddress:fail auth
    //      deny
    //       在 iPhone 真机上，错误消息 err.errMsg 的值为 chooseAddress:fail authorize
    //        no response
    // 2. 解决问题的方案 - 修改 chooseAddress 方法中的代码，进一步完善用户没有授权时的 if 判
    //       断条件即可：

         if(err &&  (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg
=== 'chooseAddress:fail authorize no response')){
           this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
         }
        }
      },
     
     // 定义reAuth方法
          async reAuth(){
       //  // // 3.1 提示用户对地址进行授权
            const[err2,confirmResult] = await uni.showModal({
              content:'检测到您没打开地址权限，是否去设置打开？',
              confirmText:"确认",
              cancelText:"取消"
            })
       //     // 3.2 如果弹框异常，则直接退出
            if(err2)return
       //     // 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
            if(confirmResult.cancelText) return uni.$showMsg("您取消了地址授权！" )
       //      // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，
       //     // 让用户重新进行授权
               if(confirmResult.confirmText){
                 uni.openSetting({
       //         // 3.4.1 授权结束，需要对授权的结果做进一步判断
              success: (settingResult) => {
       //           // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
                 if(settingResult.authSetting['scope.address']) return uni.$showMsg("授权成功！请选择地址")
       //            // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
                if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
              } 
            })
         }
      },
    },
  }
</script>

<style lang="scss">
.address-choose-box{
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  // display: flex;
  
  
}
.address-info-box{
  font-size: 12px;
  height: 90px;
  display: flex;
 flex-direction: column;
 justify-content: center;
   padding:0 5px;
}
.row1{
  display: flex;
  justify-content: space-between;
  
  .row1-right{
   display: flex;
   align-items: center;
   .phone{
     margin-right: 5px;
   }
  }
  // 第二行
  .row2 {
  display: flex;
  align-items: center;
  margin-top: 10px;
  .row2-left {
  white-space: nowrap;
  }
  }
}
.address-bottom{
    display: block;
    width: 100%;
    height: 5px;
  }
</style>