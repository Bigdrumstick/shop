// 注意：除了要在 cart.vue 页面中设置购物车的数字徽标，还需要在其它 3 个 tabBar 页面中，为购
// 物车设置数字徽标。
// 此时可以使用 Vue 提供的 mixins 特性，提高代码的可维护性。
// 在项目根目录中新建 mixins 文件夹，并在 mixins 文件夹之下新建 tabbar-badge.js 文
// 件，用来把设置 tabBar 徽标的代码封装为一个 mixin 文件：
import { mapGetters } from 'vuex'
// 导出一个 mixin 对象
export default {
          computed: {
             ...mapGetters('m_cart', ['total']),
          },
          onShow() {
         // 在页面刚展示的时候，设置数字徽标
          this.setBadge()
        },
        watch:{
          total:{
            immediate:true,
            handler(newval){
              this.setBadge()
            }
          }
        },
           methods: {
          setBadge() {
        // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
            uni.setTabBarBadge({
                 index: 2,
                 text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
            })
            // console.log(this.total);
            if(this.total + ''==="0"){
              uni.removeTabBarBadge({
                index:2
              })
            }
          },
         },
}