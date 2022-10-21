// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 在 main.js 中导入 store 实例对象并挂载到 Vue 的实例上：
import store from "./store/store.js"
// 导入小程序网络请求的包 @escook/request-miniprogram
import { $http } from "@escook/request-miniprogram";

 
// 按需导入 $http 对象

// 将按需导入的 $http 挂载到 wx 顶级对象之上，方便全局调用
wx.$http = $http

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 配置请求的根目录
$http.baseUrl = 'https://api-hmugo-web.itheima.net';

//请求拦截器： 发请求之前做的事
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: "数据加载中..."
  })
}
// 响应拦截器：请求完成之后做的事
$http.afterRequest = function(optinos) {
  uni.hideLoading()
}

// 封装请求失败弹窗的方法
uni.$showMsg = function(title = "数据加载失败！", duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  // 2. 将 store 挂载到 Vue 实例上
  store
})
app.$mount()
// #endif

//  VUE3
// import {
//   createSSRApp
// } from 'vue'
// import App from './App.vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   return {
//     app
//   }
// }
//
