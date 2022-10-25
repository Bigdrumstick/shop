// 创建用户模块
export default {
  namespaced: true,
  state:()=>({
    // 用来存储用户的收货信息
    address:JSON.parse(uni.getStorageSync('address')||'{}'),
    token:uni.getStorageSync('token')||'',
    // uni.getStorageSync('token')||
    // // 用户的基本信息
    userinfo:JSON.parse(uni.getStorageSync("userinfo")||'{}'),
    // 重定向的 object 对象 { openType, from }
    // 返回页面的信息对象，主要包含 { openType, from } 两个属性，其中 openType 表示以哪种方式导
    // 航回之前的页面；from 表示之前页面的 url 地址；
    redirectInfo: null
  }),
  // state:{
  //   address: JSON.parse(uni.getStorageSync('address') || '{}'),
  //   token:uni.getStorageSync('token')||'',
  //   // // 用户的基本信息
  //   userinfo:JSON.parse(uni.getStorageSync("userinfo")||'{}')
  // },
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
     },
     // // 更新用户的基本信息
    updateUserInfo(state,userinfo){
      state.userinfo=userinfo
      // // 通过 this.commit() 方法，调用 m_user 模块下的 saveUserInfoToStorage 方
// 法，将 userinfo 对象持久化存储到本地
        // console.log(userinfo)
       this.commit('m_user/saveUserInfoToStorage')
    },
    // b保存用户信息到本地
    saveUserInfoToStorage(state){
      uni.setStorageSync("userinfo",JSON.stringify('state.userinfo'))
    },
    // 更新 token 字符串
    updateToken(state,token){
      state.token=token
      // console.log(state.token);
      // 保存token
      this.commit('m_user/saveTokenToStorage')
      // console.log(token);
    },
    // 永久保存token到本地的方法
    saveTokenToStorage(state){
      uni.setStorageSync("token",state.token)
    },
    // 更新重定向的数据
    updateRedirectInfo(state,info){
      state.redirectInfo=info
      // this.commit("m_user/saveRedirectToStorage")
    },
    // //永久保存重定向信息
    // saveRedirectToStorage(state){
    //   uni.getStorageSync("redirectInfo",JSON.stringify("state.redirectInfo"))
    // }
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