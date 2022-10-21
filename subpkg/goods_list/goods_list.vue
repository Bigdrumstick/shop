<template>
  <view class="goods-list-container">
    <navigator v-for="(item,i) in goodsList" :key="i"  :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id"> 
      <my-goods :goods="item"></my-goods>
    </navigator>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 发请求需要的参数
        queryObj:{
          // 查询关键字
          query:'',
          // 商品的id
          cid:'',
          // 当前第几页
          pageNo:1,
          // 每页的有几个数据
          limit:10,
        },
        // 获取的商品列表
        goodsList:[],
       // 总共有几条数据
       total:'',
       // 节流阀，防止发送没必要的请求
       isLoading:false
      };
    },
    
    // 在onload生命周期中获取当前页数据保存到data中
    onLoad(options) {
      // console.log(options);
      this.queryObj.query=options.query||'',
      this.queryObj.cid=options.cid||''
      // 获取商品列表
      this.getGoodsList()
      
    },
   
   
    methods: {
      // 获取商品列表的方法
      async getGoodsList(cb) {
        // 在请求数据前后，分别打开和关闭节流阀：
        this.isLoading=true
        const {data:res}=await uni.$http.get("/api/public/v1/goods/search",this.queryObj)
        this.isLoading=false
        // console.log(res);
        // 只要数据请求完毕，就立即按需调用 cb 回调函数
        cb && cb()
        if(res.meta.status!==200)return uni.$showMsg()
        this.goodsList=[...this.goodsList,...res.message.goods]
        this.total=res.message.total
        
      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 重置数据
      this.queryObj.pageNo=1
    this.total=0
    this.isLoading=false
    this.goodsList=[]
      this.getGoodsList(()=>{uni.stopPullDownRefresh()})
      
      
    },
     
     // 上拉触底获取更多数据
     onReachBottom() {
       if(this.isLoading) return
      
       // 当前的页码值 * 每页显示多少条数据 >= 总数条数
// pagenum * pagesize >= total
         if(this.queryObj.pageNo*this.queryObj.limit>=this.total) return uni.$showMsg('数据加载完毕')
         // 判断有没有正在发送请求，如果有就直接返回，避免发送多余的请求
         if(this.isLoading)return
         this.queryObj.pageNo++
       this.getGoodsList()
     }
  
  }
</script>

<style lang="scss">

</style>
