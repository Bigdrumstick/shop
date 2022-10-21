<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none" focus @confirm="search"></uni-search-bar>
    </view>
    <view class="sugg-list"  v-if="searchResultList.length!==0">
      <view class="sugg-list-item" v-for="(item,i) in searchResultList" :key="item.goods_id" @click="gotoGoodsDetail(item)" >
        <view class="text">{{item.goods_name}}</view>
         <uni-icons type="arrowright" size="16" ></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
       <uni-icons type="trash" size="16"  @click="clearHistory"></uni-icons>
      </view>
      <view class="history-list" >
        <uni-tag :text="item" v-for="(item,i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
    </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 防抖器的timerId
        timer: null,
        // 搜索关键字
        kw: '',
        // 搜索的结果列表
        searchResultList: [],
        // 先定义搜索的假数据
        historyList:[],
      };
    },
    onLoad() {
  
// 在 onLoad 生命周期函数中，加载本地存储的搜索历史记录：
this.historyList=JSON.parse(uni.getStorageSync('kw')||'[]')
    },
    methods: {
      // input框发生改变时
      input(e) {
        // console.log(e);
        // 定义如下的 input 事件处理函数：
        // e.value 是最新的搜索内容
        //清除延时器
        clearTimeout(this.timer)
        // 重新开启一个延时器
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          this.kw = e
          // console.log(this.kw);
          // 发送搜索的请求
          this.getSearchResult()
          
        }, 500);
      },
         
         // 当点击手机搜索按钮时
        search(v){
           this.kw=v.value
           // 发送搜索的请求
           this.getSearchResult()
           
           // 如果关键词搜索得不到结果
           if(this.searchResultList.length===0){
             uni.showToast({
               title:"没有相关结果",
               duration:3000,
               icon:'error'
             })
           }else{
             //获取到关键词之后调用保存关键词的方法
              this.saveHistory()
           }
           
             
         },

   //获取搜索关键词列表
      async getSearchResult() {
        // 先判断搜索框有没有内容
        //console.log("getSearchResult:Kw"+this.kw)
        if (this.kw === '') {
          this.searchResultList = []
          return
        }
        // console.log(this.kw);
        const {data:res} = await uni.$http.get("/api/public/v1/goods/qsearch", { query: this.kw})
        // console.log(res);
         // 将得到的数据赋值到列表
          // console.log(res)
          if(res.meta.status!==200)return uni.$showMsg()
        this.searchResultList = res.message
        
      },
    // 点击搜索列表跳转到商品详情页
    gotoGoodsDetail(item){
      uni.navigateTo({
        url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id
      })
      this.saveHistory(this.kw)
    },
    // 保存关键词到历史记录
    saveHistory(){
      // this.historyList.push(this.kw)
    // 数组去重：1.先将Array数组转化为set对象
     const set = new Set(this.historyList)
     // 2.调用set的delete的方法剔除数据
     if(this.kw.indexOf(set)!==-1){
       set.delete(this.kw)
     }
     // // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
     set.add(this.kw)
     // // 4. 将 Set 对象转化为 Array 数组
     this.historyList=Array.from(set)
     //将历史记录永久保存在本地
     // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
     uni.setStorageSync('kw',JSON.stringify(this.historyList))
    },
    
    // 点击删除历史事件处理函数
    clearHistory(){
      // 清空data中的数据
      this.historyList=[]
      // 清空本地存储的数据
      uni.setStorageSync('kw','[]')
    },
    
    // 点击历史记录的每一项跳转到响应的商品列表
  gotoGoodsList(kw){
    // console.log(kw);
     uni.navigateTo({
       url:'/subpkg/goods_list/goods_list?query='+kw
     })
        
    },
},
    computed: {
      // 将历史记录的顺序倒过来
      historys() {
        // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数
        // 组中元素的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转
        return [...this.historyList].reverse()
      }
    },
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 9999;
  };
  .sugg-list{
    padding: 0 5px;
    .sugg-list-item{
      padding: 10px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
       align-items: center;
       justify-content: space-between
    }
    .text{
      // line-height: 20px;
      font-size: 12px;
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
       overflow: hidden;
       // 文本溢出后，使用 ... 代替
       text-overflow: ellipsis;
       margin-right: 5px;
    }
  }

.history-box{
  padding: 0 5px;
  .history-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  };
  .history-list{
    display: flex;
    flex-wrap: wrap;
    uni-tag{
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
