<template>
  <view>
   <view class="settle-box" >
     <label class="radio" @click="changeAllState">
       <radio color="#c00000"  :checked="isFullCheck"  /><text>全选</text>
       </label>
      
      <view class="sum">
        合计:
        <text class="price">￥{{checkedGoodsAmount}}</text>
      </view>
      <view class="sum-right">
        结算（{{checkedCount}}）
      </view>
   </view>
   
  </view>
</template>

<script>
  import{mapGetters ,mapMutations} from "vuex"
  export default {
    name:"my-settle",
    // props:{
    //   goods:{
    //     type:Object,
    //     default:{}
    //   }
    // }
    data() {
      return {
        
      };
    },
    computed: {
     ...mapGetters("m_cart",["checkedCount","total","checkedGoodsAmount"]),
     // 使用 mapGetters 辅助函数，将商品的总数量映射到当前组件中使用，并定义一个叫做
// isFullCheck 的计算属性：
      isFullCheck(){
        return this.total===this.checkedCount
      }
    },
    methods: {
      ...mapMutations("m_cart",["updateAllGoodsState"]),
      // // label 的点击事件处理函数
      // 修改购物车中所有商品的选中状态
      // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      }
    },
  }
</script>

<style lang="scss">
.settle-box{
  display: flex;
  height: 50px;
  font-size: 14px;
  font-weight: 500;
 padding-left: 5px;
  align-items: center;
  justify-content: space-between;
  // background-color:  cyan;
  background-color: white;
  
  /* 底部固定定位 */
  position: fixed;
  bottom: 0;
  left: 0;
  .radio {
   display: flex;
   align-items: center;
   }
  .sum{
    
    margin:0 50px;
    .price{
      color: #c00000;
    }
  }
  .sum-right{
    height: 100%;
    min-width:100px;
    background-color: #c00000;
    color: #fff;
    line-height: 50px;
    padding: 0 10px;
    text-align: center;
  }
}
</style>