// 创建用户模块
export default {
  namespaced: true,
  // state:()=>({
  //   // 用来存储用户的收货信息
  //   address:JSON.parse(uni.getStorageSync('address')||'{}')
  // }),
  state:{
    address:JSON.parse(uni.getStorageSync('address')||'{}')
  },
  mutations:{
     // 更新用户信息
     updateAddress(state,address){
       // console.log(address);
       state.address=address
       // 持久保存本地
       // console.log(address);
       this.commit('m_user/saveTostorage')
     },
     // 保存本地的方法
     saveTostorage(state){
       uni.setStorageSync('address',JSON.stringify('state.address'))
     }
  },
  getters:{
    // 目的：为了提高代码的复用性，可以把收货的详细地址抽离为 getters，方便在多个页面和组件之
    // 间实现复用。
     // 收货详细地址的计算属性
      addstr(state) {
          if (!state.address.provinceName) return ''
          // 拼接 省，市，区，详细地址 的字符串并返回给用户
          return state.address.provinceName + state.address.cityName +
          state.address.countyName + state.address.detailInfo
     }
  }
  
}