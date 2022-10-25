<template>
  <view class="my-userinfo-container">
    <!-- 头像昵称区域 -->
    <view class="user-avatar">
      <image class="avatar" :src="userinfo.avatarUrl"></image>
     <view class="nickname">{{userinfo.nickName}}</view>
    </view>
    <!-- 面板的列表区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <!-- 第一个面板的主体区域 -->
        <view class="panel-body">
          <view class="panel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="panel">
        <view class="title"> 我的订单</view>
         <view class="panel-body">
           <view class="panel-item">
             <image src="../../static/my-icons/icon1.png" class="icon"></image>
             <text>待付款</text>
           </view>
           <view class="panel-item">
             <image src="../../static/my-icons/icon2.png" class="icon"></image>
             <text>待收货</text>
           </view>
           <view class="panel-item">
             <image src="../../static/my-icons/icon3.png" class="icon"></image>
             <text>退货/退款</text>
           </view>
           <view class="panel-item">
             <image src="../../static/my-icons/icon4.png" class="icon"></image>
             <text>全部订单</text>
           </view>
         </view>
      </view>
      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons type="arrowright"></uni-icons>  
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons type="arrowright"></uni-icons>  
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright"></uni-icons>  
        </view>
        
      </view>
    </view>
  </view>
</template>

<script>
  import {mapState,mapMutations} from 'vuex' 
  export default {
    name:"my-userinfo",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('m_user',['userinfo']),
    },
   methods: {
     ...mapMutations("m_user",["updateAddress","updateUserInfo","updateToken"]),
     // 退出登录
     async logout() {
       // 询问用户是否退出登录 弹出模态框uni.showModal
       const [err,succ]=await uni.showModal({
         title:"提示",
         content:"确定退出登录吗？",
       }).catch(err=>err)
       if(succ&&succ.confirm){
         // 用户确认了退出登录的操作
         // 需要清空 vuex 中的 userinfo、token 和 address
         this.updateAddress({}),
         this.updateUserInfo({}),
         this.updateToken('')
       }
       // console.log(this.updateAddress);
       // console.log( this.updateUserInfo);
       // console.log(this.updateToken);
     }
   },
  }
</script>

<style lang="scss">
.my-userinfo-container{
  height: 100%;
  // 为整个组件的结构添加浅灰色的背景
  background-color: #f4f4f4;
  .user-avatar{
    height: 400rpx;
    background-color: #c00000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:center;
    .avatar{
      width: 100px;
      height: 100px;
      display: block;
      border-radius: 45px;
      border: 2px solid white;
      box-shadow: 0 1px 5px black;
    }
    .nickname{
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      margin-top: 15px;
    }
  }
  .panel-list{
   position: relative;
   top: -10px;
   padding: 0 10px;
    .panel{
      background-color: #fff;
      border-radius: 3px;
      margin-bottom: 8px;
      .title{
        line-height: 45px;
        padding-left: 10px;
        font-size: 15px;
        border-bottom: 1px solid #f4f4f4;
      }
      .panel-body{
        display: flex;
        justify-content: space-around;
        .panel-item{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          font-size: 13px;
          padding: 10px 0;
          .icon{
           width: 35px;
           height: 35px;
          }
          
        }
      }
    }
    
  .panel-list-item{
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding:0 10px ;
  }
  }
}
</style>