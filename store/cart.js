// 创建购物车的 store 模块
export default{
  // 为当前模块开启命名空间
  namespaced: true,// 模块的 state 数据
state: () => ({
// 购物车的数组，用来存储购物车中每个商品的信息对象
// 每个商品的信息对象，都包含如下 6 个属性：
// { goods_id, goods_name, goods_price, goods_count,
// goods_small_logo, goods_state }
  cart:JSON.parse(uni.getStorageSync('cart')||'[]')}),
// 模块的 mutations 方法
mutations: {
  // 添加到购物车
  addToCart(state,goods ){
    // 根据提交的商品的Id，查询购物车中是否存在这件商品
    // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
    const findResult=state.cart.find(x=>x.goods_id===goods.goods_id)
    // console.log(findResult);
    if(!findResult){
      // 如果购物车中没有这件商品，则直接 push
      state.cart.push(goods)
    }else{
      // 如果购物车中有这件商品，则只更新数量即可
      findResult.goods_count++
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    }
    // console.log(state.cart);
    },
    // 在 cart.js 模块中，声明一个叫做 saveToStorage 的 mutations 方法，此方法负责将购物
    // 车中的数据持久化存储到本地：
          saveToStorage(state){
           uni.setStorageSync('cart',JSON.stringify(state.cart))
          },
          
          // // 更新购物车中商品的勾选状态
          updateGoodsState(state,goods){
            const findResult=state.cart.find(x=>x.goods_id===goods.goods_id)
            if(findResult){
              findResult.goods_state=goods.goods_state
              // console.log(findResult.goods_state);
            }
            // 持久化存储到本地
              this.commit('m_cart/saveToStorage') 
 
          },
          // // // 更新购物车中商品的数量状态
          updateGoodsCount(state,goods){
            const findResult=state.cart.find(x=>x.goods_id===goods.goods_id)
            if(findResult){
              findResult.goods_count=goods.goods_count
            }
          },
          // // 根据 Id 从购物车中删除对应的商品信息

          removeGoodsById(state,goods_id){
            state.cart=state.cart.filter(x=>x.goods_id!==goods_id)
            // console.log(goods_id);
            this.commit("m_cart/saveToStorage")
          },
          // 在 store/cart.js 模块中，定义一个叫做 updateAllGoodsState 的 mutations 方法，用来
// 修改所有商品的勾选状态：
     updateAllGoodsState(state,newState){
       // console.log(newState);
      state.cart.forEach(x=>{
        return x.goods_state=newState
      })
      // console.log(state.cart);
      // c持久存储本地
      this.commit("m_cart/saveToStorage")
     }
},
// 模块的actions方法
actions:{
  
},
// 模块的getter方法
getters:{
  // 在 cart.js 模块中，在 getters 节点下定义一个 total 方法，用来统计购物车中商品的
// 总数量：
// 统计购物车中商品的总数量
      total(state) {
        let c = 0
  // 循环统计商品的数量，累加到变量 c 中
       state.cart.forEach(goods => c += goods.goods_count)
           return c
    } ,
    
    // 在 store/cart.js 模块中，定义一个名称为 checkedCount 的 getters，用来统计已勾选商
    // 品的总数量：
    checkedCount(state){
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
    return state.cart.filter(x=>x.goods_state).reduce((total,item) => total+=item.goods_count,0)
    },
    // // 已勾选的商品的总价
    // // 先使用 filter 方法，从购物车中过滤器已勾选的商品
// 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
// reduce() 的返回值就是已勾选的商品的总价
// 最后调用 toFixed(2) 方法，保留两位小数
    checkedGoodsAmount(state){
      return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total += item.goods_price*item.goods_count,0).toFixed(2)
    }
}
}