<template>
  <view class="goods-detail-container">
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" indicator-color="#ddd" circular>
      <swiper-item v-for="(item,i) in goodsInfo.pics" :key="i" class="swiper-item">
       <image :src="item.pics_big"  @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 价格展示 -->
    <!-- 导致问题的原因：在商品详情数据请求回来之前，data 中 goods_info 的值为 {} ，因此初次
渲染页面时，会导致 商品价格、商品名称 等闪烁的问题。
2. 解决方案：判断 goods_info.goods_name 属性的值是否存在，从而使用 v-if 指令控制页面
的显示与隐藏： -->
    <view class="price" v-if="goodsInfo.goods_price">
      ￥{{goodsInfo.goods_price}}
    </view>
    <view class="goods-text">
      <view class="goods-name" v-if="goodsInfo.goods_name">
        {{goodsInfo.goods_name}}
      </view>
      <view class="icon">
        <uni-icons type="star" size="18" color="#c1c1c1"></uni-icons>
        <text>收藏</text>
      </view>
    </view>
   <view class="yf">
     快递：免运费
     
   </view>
   <!-- 在页面结构中，使用 rich-text 组件，将带有 HTML 标签的内容，渲染为小程序的页面结构： -->
   <rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
   <!-- 基于 uni-ui 提供的 GoodsNav 组件来实现商品导航区域的效果 -->
   <view class="goods_nav">
   <!-- fill 控制右侧按钮的样式 -->
   <!-- options 左侧按钮的配置项 -->
   <!-- buttonGroup 右侧按钮的配置项 -->
   <!-- click 左侧按钮的点击事件处理函数 -->
   <!-- buttonClick 右侧按钮的点击事件处理函数 -->
   <uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup"  @click="gotoShopCat" @buttonClick="buttonClick"/>
   </view>
  </view>
</template>

<script>
  // 在商品详情页面中，通过 mapMutations 这个辅助方法，把 vuex 中 m_cart 模块下的
  // addToCart 方法映射到当前页面：
  import { mapState ,mapMutations,mapGetters} from "vuex"  
  export default {
    data() {
      return {
      // 用来保存商品详情信息
      goodsInfo:{},
      options:[{
        icon:'shop',
        text:'店铺',
        
      },{
        icon:'cart',
        text:'购物车',
        info:2
      }],
      buttonGroup:[{
        text:'加入购物车',
        backgroundColor:"#ff0000",
        color:"#fff"
      },{
        text:'立即购买',
        backgroundColor:"#ff910a",
        color:"#fff"
      }
       
      ]
      
      };
    },
    //在onload生命周期获取外界传来的数据
    onLoad(options) {
      // console.log(e);
      // 发送获取商品详情请求
      const goods_id=options.goods_id
      this.getGoodsInfo(goods_id)
       
    },
    computed: {
      // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算
      // 属性来使用
      // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
     // ...mapState('m_cart',['cart']),
     // ...mapState({cart:state=>state.moduleCart.cart}),
     // 注意：今后无论映射 mutations 方法，还是 getters 属性，还是 state 中的数据，都需要指定
     // 模块的名称，才能进行映射。
      // 在页面渲染时，可以直接使用映射过来的数据，例如：
      // <!-- 运费 -->
       // <view class="yf">快递：免运费 -- {{cart.length}}</view>
           // // 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
         ...mapGetters('m_cart',['total'])
    },
    watch:{
      // 通过 watch 侦听器，监听计算属性 total 值的变化，从而动态为购物车按钮的徽标赋值：
     total:{
       // handler 属性用来定义侦听器的 function 处理函数
         handler(newVal){
         // 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
          // 2. 通过数组的 find() 方法，找到购物车按钮的配置对象
           const findResult = this.options.find((x) => x.text === '购物车')
            if (findResult) {
           // 3. 动态为购物车按钮的 info 属性赋值
              findResult.info = newVal
             }},
             // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
             immediate:true
       }
      
    },
    
    methods: {
      // 添加到购物车
      buttonClick(e){
        if(e.content.text==="加入购物车"){
          // 2. 组织一个商品的信息对象
          const goods = {
          goods_id: this.goodsInfo.goods_id, // 商品的Id
          goods_name: this.goodsInfo.goods_name, // 商品的名称
          goods_price: this.goodsInfo.goods_price, // 商品的价格
          goods_count: 1, // 商品的数量
          goods_small_logo: this.goodsInfo.goods_small_logo, // 商品的图片
          goods_state: true // 商品的勾选状态
          }            // 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
             this.addToCart(goods)
          
        }
      },
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart',['addToCart']),
      // 点击底部左侧跳转到购物车
      gotoShopCat(e){
        // console.log(e);
        if(e.content.text==="购物车"){
          // 切换到购物车页面
          uni.switchTab({
            url:"/pages/cart/cart"
          })
        }
        
        },
    
      // 获取商品详情方法
      async getGoodsInfo(goods_id) {
        const {data:res}=await uni.$http.get('/api/public/v1/goods/detail',{goods_id})
        // console.log(res);
        if(res.meta.status!==200)return uni.$showMeg()
        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部
        // 空白间隙的问题
        // 解决 .webp 格式图片在 ios 设备上无法正常显示的问题：
        // // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
       res.message.goods_introduce= res.message.goods_introduce.replace(/<img/g,'<img style="display:block;" ').replace(/webp/g,'jpg')

        this.goodsInfo=res.message
      },
      // 点击图片的preview(i)处理事件
      preview(i){
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
        // 预览时，默认显示图片的索引
        current: i,
        // 所有图片 url 地址的数组
        urls: this.goodsInfo.pics.map(x => x.pics_big)
        })
    },
    
    
    
    },
    
  }
</script>

<style lang="scss">
  .goods-detail-container{
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖  padding-bottom: 50px;

  }
  .goods_nav{
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom:0;
    left: 0;
    width: 100%;
  }
  swiper{
    height: 750rpx;
    image{
      width:100%;
      height: 100%;
    }
  }
.price{
  padding: 10px;
  color: #C00000;
  font-size: 18px;
  font-weight: bold;
}
.goods-text{
  display: flex;
  .goods-name{
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
    font-size: 12px;
    border-right: 1px solid #efefef;
  }
  .icon{
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #c1c1c1;
    text{
      font-size: 12px;
     
    }
  }
  
}
.yf{
    font-size: 12px;
    color:#c1c1c1 ;
     padding: 10px;
  }

</style>
