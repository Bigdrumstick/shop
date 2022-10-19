<template>
  
    <view class="goods-list-item" >
      <view class="left-img">
        <image :src="goods.goods_small_logo || defaultPic"></image>
      </view>
      <view class="right">
         <text class="right-text">{{goods.goods_name}}</text>
          <!-- // 在渲染商品价格的时候，通过管道符 | 调用过滤器： -->
         <text class="right-price">￥{{goods.goods_price|tofixed }}</text>
      </view>
       
    </view>

</template>

<script>
  export default {
    name:"my-goods",
    // 用来接收外界传来的值
    props:{
    
      goods:{
      type:Object,
      default:{}
      }
    },
    data() {
      return {
        // 默认的空图片
        defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters:{
      // 把数字处理为带两位小数点的数字
     
      tofixed(num){
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
.goods-list-item{
    border: 1px solid #efefef;
    display: flex;
   padding: 10px 5px;
   
    .left-img{
      display: flex;
      justify-content: center;
      align-items: center;
     padding-right:5px;
      image{
        width: 100px;
        height: 100px;
        display: block
      };
    }
    .right{
      display: flex;
     flex-direction: column;
     justify-content: space-between;
     .right-text{
       font-size: 13px;
       // margin: 10px 0;
       height: 80px;
     }
     .right-price{
       color: #C00000;
       font-size: 16px;
       // margin-bottom: 10px;
     }
    }
  }
</style>