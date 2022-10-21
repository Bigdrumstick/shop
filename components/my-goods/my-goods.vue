<template>
  
    <view class="goods-list-item" >
      <view class="left-img">
       <!-- 动态为 radio 绑定选中状态： 存储在购物车中的商品，包含 goods_state 属性，表示商品的勾选状态 --> 
          <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio"  @click="radioChangeHandler"/>
        <image :src="goods.goods_small_logo || defaultPic"></image>
      </view>
      <view class="right">
         <text class="right-text">{{goods.goods_name}}</text>
         <view class="right--info-box">
           <!-- // 在渲染商品价格的时候，通过管道符 | 调用过滤器： -->
           <text class="right-price">￥{{goods.goods_price|tofixed }}</text>
           <!--为 my-goods 组件封装 NumberBox: NumberBox 组件是 uni-ui 提供的  @change="" -->
           <!-- 动态为 NumberBox 组件绑定商品的数量值： :value="goods.goods_count"-->
           <uni-number-box v-if="showNumBox"  @change="numChangeHandler" :min="1" :value="goods.goods_count">             </uni-number-box>
         </view>
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
      },
      // 封装名称为 showRadio 的 props 属性，来控制当前组件中是否显示 radio 组件：
      showRadio:{
        type:Boolean,
        default:false
      },
      // 
      showNumBox:{
        type:Boolean,
        default:false
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
    },
  methods: {
    // radio 组件的点击事件处理函数
    // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
    // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
    radioChangeHandler() {
      this.$emit('radio-change',{
        goods_id:this.goods.goods_id,
        goods_state:!this.goods.goods_state
      })
    },
    numChangeHandler(val){
      // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
      this.$emit('num-change',{
        goods_id:this.goods.goods_id,
        goods_count:+val
      })
    },
    // 解决 NumberBox 数据不合法的问题
    // 问题说明：当用户在 NumberBox 中输入字母等非法字符之后，会导致 NumberBox 数据紊乱的问
// 题
//  打开项目根目录中 components/uni-number-box/uni-number-box.vue 组件，修改
// methods 节点中的 _onBlur 函数如下：
   // _onBlur(event) {
   // 官方的代码没有进行数值转换，用户输入的 value 值可能是非法字符：
   // let value = event.detail.value;
   // 将用户输入的内容转化为整数
   // let value = parseInt(event.detail.value);
   // if (!value) {
   // // 如果转化之后的结果为 NaN，则给定默认值为 1
   // this.inputValue = 1;
   // return;
   // }
   // // 省略其它代码...
   // }
   //  完善 NumberBox 的 inputValue 侦听器   // 问题说明：在用户每次输入内容之后，都会触发 inputValue 侦听器，从而调用
     // this.$emit("change", newVal) 方法。这种做法可能会把不合法的内容传递出去！
      // 打开项目根目录中 components/uni-number-box/uni-number-box.vue 组件，修改 watch
     // 节点中的 inputValue 侦听器如下：
     // inputValue(newVal, oldVal) {
     // // 官方提供的 if 判断条件，在用户每次输入内容时，都会调用 this.$emit("change",
     // newVal)
     // // if (+newVal !== +oldVal) {
     // // 新旧内容不同 && 新值内容合法 && 新值中不包含小数点
     // if (+newVal !== +oldVal && Number(newVal) && String(newVal).indexOf('.')
     // === -1) {
     // this.$emit("change", newVal);
     // }
     // }
     // 修改完毕之后，NumberBox 组件只会把合法的、且不包含小数点的新值传递出去
  },
  
  
  }
</script>

<style lang="scss">
.goods-list-item{
  // 让 goods-item 项占满整个屏幕的宽度
  width: 750rpx;
  // // 设置盒模型为 border-box
  box-sizing: border-box;
    border: 1px solid #efefef;
    display: flex;
   padding: 10px 5px;
   
    .left-img{
      display: flex;
      justify-content: space-between;
      align-items: center;
       // margin:5px;
      image{
        width: 100px;
        height: 100px;
        display: block
      };
    }
    .right{
      display: flex;
      flex:1;
     flex-direction: column;
     justify-content: space-between;
     .right-text{
       font-size: 12px;
       // margin: 10px 0;
       height: 80px;
     }
     .right--info-box{
       display: flex;
       align-items: center;
       justify-content: space-between;
       .right-price{
         color: #C00000;
         font-size: 15px;
         // margin-bottom: 10px;
       }
     }
    
    }
  }
</style>