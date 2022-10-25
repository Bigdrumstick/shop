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
      <!-- 需求描述：在购物车页面，当用户点击 “结算” 按钮时，如果用户没有登录，则 3 秒后自动跳转到
登录页面  
       改造 结算 按钮的 click 事件处理函数，如果用户没有登录，则预调用一个叫做
       delayNavigate 的方法，进行倒计时的导航跳转： -->
      <view class="sum-right" @click="settlement">
        结算（{{checkedCount}}）
      </view>
   </view>
   
  </view>
</template>

<script>
  import{mapGetters ,mapMutations,mapState} from "vuex"
  /*
     微信支付的流程:
     1. 创建订单
       请求创建订单的 API 接口：把（订单金额、收货地址、订单中包含的商品信息）发送到服务
       器
       服务器响应的结果：订单编号
     2. 订单预支付
       请求订单预支付的 API 接口：把（订单编号）发送到服务器
       服务器响应的结果：订单预支付的参数对象 ，里面包含了订单支付相关的必要参数
    3. 发起微信支付
       调用 uni.requestPayment() 这个 API，发起微信支付；把步骤 2 得到的 “订单预支付对
       象” 作为参数传递给 uni.requestPayment() 方法
       监听 uni.requestPayment() 这个 API 的 success ， fail ， complete 回调函数
  */ 
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
        // 倒计时的秒数
        seconds: 3,
        timer:null
      };
    },
    computed: {
      // // token 是用户登录成功之后的 token 字符串
      ...mapState("m_user",["token"]),
      // 得到store中cart的cart对象
      ...mapState("m_cart",['cart']),
      // // addstr 是详细的收货地址
      ...mapGetters("m_user",["addstr"]),
     ...mapGetters("m_cart",["checkedCount","total","checkedGoodsAmount"]),
     // 使用 mapGetters 辅助函数，将商品的总数量映射到当前组件中使用，并定义一个叫做
// isFullCheck 的计算属性：
      isFullCheck(){
        return this.total===this.checkedCount
      }
    },
    methods: {
      ...mapMutations("m_cart",["updateAllGoodsState"]),
      ...mapMutations("m_user",['updateRedirectInfo']),
      // // label 的点击事件处理函数
      // 修改购物车中所有商品的选中状态
      // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      settlement(){
        // 1. 先判断是否勾选了要结算的商品
        if(!this.checkedCount)return uni.$showMsg("请选择要结算的商品！")
        // 2. 再判断用户是否选择了收货地址
        if(!this.addstr) return uni.$showMsg("请选择收货地址")
        // // 3. 最后判断用户是否登录了 delayNavigate
        if(!this.token)return this.dedelayNavigate()
        // // 4. 实现微信支付功能
        this.payOrder()
        // console.log("1111");
        
      },
      // 需求描述：在购物车页面，当用户点击 “结算” 按钮时，如果用户没有登录，则 3 秒后自动跳转到登录页面
      // 展示倒计时的方法
      showTip(n){
        // // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          icon:"none",
          // 提示的消息
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
      // 定义 delayNavigate 方法，初步实现倒计时的提示功能：
      dedelayNavigate(){
        // seconds 秒数不会被重置，导致第 2 次，3 次，n 次 的倒计时跳转功能无法正常工作
        this.seconds=3
        this.showTip(this.seconds)
        // 延迟导航到 my 页面
        // 1. 展示提示消息，此时 seconds 的值等于 3
        this.showTip(this.seconds),
        // 下述代码的问题：定时器不会自动停止，此时秒数会出现等于 0 或小于 0 的情况！
       
        // 2. 创建定时器，每隔 1 秒执行一次
        // // 1. 将定时器的 Id 存储到 timer 中
      this.timer= setInterval(()=> {
          // // 2.1 先让秒数自减 1
          this.seconds-=1
          // // 2. 判断秒数是否 <= 0
          if(this.seconds<=0){
            // 2.1 清除定时器
             clearInterval(this.timer)
          // // 2.2 跳转到 my 页面
          uni.switchTab({
            url:"/pages/my/my",
            // // 页面跳转成功之后的回调函数
            success:() =>{
              // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
              this.updateRedirectInfo({
                // 跳转的方式
                openType:'switchTab',
                // 从哪个页面跳转过去的
                from:'/pages/cart/cart'
              })
            }
          })
          // 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
          return
          }
          // 3 再根据最新的秒数，进行消息提示
          this.showTip(this.seconds)
        }, 1000);
        
      },
      // // 微信支付// 
      async payOrder(){
        // 1. 创建订单
         // 1.1 组织订单的信息对象
         const orderInfo={
           // 开发期间，注释掉真实的订单价格，
           // order_price: this.checkedGoodsAmount,
           // 写死订单总价为 1 分钱
           order_price: 0.01,
           consignee_addr: this.addstr,
           goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id:
           x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
         }
        // 1.2 发起请求创建订单
        const { data: res } = await
        uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
         // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        
         // // 1.3 得到服务器响应的“订单编号”
         const orderNumber=res.message.order_number
         // // 2. 订单预支付
         // // 2.1 发起请求获取订单的支付信息
         const {data:res2}=await uni.$http.post("/api/public/v1/my/orders/req_unifiedorder",{order_number:orderNumber})
         // console.log(res2);
         if(res2.meta.status!==200)return uni.$showError("预付订单生成失败！")
         // // 2.3 得到订单支付相关的必要参数
         const payInfo=res2.message.pay
         // // 3. 发起微信支付
         // // 3.1 调用 uni.requestPayment() 发起微信支付
         const [err,succ]=await uni.requestPayment(payInfo)
         console.log(err,succ);
         // // 3.2 未完成支付
         if(err)return uni.$showMsg('订单未支付！')
         // // 3.3 完成了支付，进一步查询支付的结果
         const {data:res3}=await uni.$http.post("/api/public/v1/my/orders/chkOrder",{order_number:orderNumber})
         // // 3.4 检测到订单未支付
         if(res3.meta.status!==200)return uni.$showMsg("订单未支付")
         // // 3.5 检测到订单支付完成
         uni.showToast({
           title:"已完成支付",
           icon:"success"
         })
         
         
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