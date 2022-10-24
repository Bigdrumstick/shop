<template>
  <view >
    <!-- 购物车没有商品 -->
    <view class="cart-empty" v-if="cart.length ===0">
      <image src="../../static/cart_empty@2x.png"  class="empty-img"></image>
      <text class="empty-text">空空如也~~</text>
    </view>
    <!--购物车有商品 -->
    <view class="cart-container" v-else >
      <my-address></my-address>
      <view class="cart-title">
        <!-- 标题的左边图标区域 -->
        <uni-icons type="shop" size="25" class="icon"></uni-icons>
        <!-- 标题右边文字区域 -->
        <text>购物车</text>
      </view>
      <!-- 商品图片列表区域 -->
      <!-- 滑动删除需要用到 uni-ui 的 uni-swipe-action 组件和 uni-swipe-action-item。详细的官方文档请参
      考SwipeAction 滑动操作。 -->
      <!-- uni-swipe-action 是最外层包裹性质的容器 -->
      <uni-swipe-action>
        <block v-for="(goods,i) in cart" :key="i">
        <!--  uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 --> 
        <uni-swipe-action-item :right-options="options"  @click="swipeActionClickHandler(goods)">
          <!-- 在 radioChangeHandler 事件处理函数中，通过事件对象 e，得到商品的 goods_id
          和 goods_state -->
              <my-goods :goods="goods" :showRadio="true" @radio-change="radioChangeHandler" :showNumBox="true"           @num-change="numChangeHandler"></my-goods>
        </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
      <!-- 结算区域 -->
      <my-settle :goods="goods"></my-settle>
    </view>
    
  </view>
 
 
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {  mapState, mapMutations  } from "vuex"
  
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    data() {
      return {
          // 设置滑动之后显示的内容
          options:[
            {text:"删除",
            style:{
              backgroundColor:"#C00000",
             
            },
            }
          ]
      };
    },
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    methods: {
      radioChangeHandler(e) {
        // console.log(e);
        // // 商品的勾选状态发生了变化
        this.updateGoodsState(e)
        // console.log(e);
      },
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount','removeGoodsById']),
      // 把最新的数量传给仓库
      numChangeHandler(e) {
        // console.log(e);
        this.updateGoodsCount(e)
      },
        // 滑动点击事件
        swipeActionClickHandler(goods){
          // console.log(goods);
          this.removeGoodsById(goods.goods_id)
        }

    },

  }
</script>

<style lang="scss">
  .cart-empty{
    display:flex;
    flex-direction: column;
    align-items: center;
    padding-top: 300rpx;
    .empty-img{
      width: 100px;
      height: 100px;
      padding-bottom: 30rpx;
    }
    .empty-text{
      font-size: 12px;
      color: #535353;
      
    }
    
  }
  .cart-container{
    // ，防止页面底部被覆
    padding-bottom: 50px;
  }
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    text {
      margin-left: 10px;
    }
  }
</style>
