<template>
  <view class="my-search-container" :style="{'background-color': bgcolor}">
    <!-- 使用view组件模拟输入框的样式 
    注意：在当前组件中，我们使用 view 组件模拟 input 输入框的效果；并不会在页面上渲染
真正的 input 输入框 -->
    <view class="my-search-box" :style="{'border-radius':radius}" @click="searchBoxhandler">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {

    name: "my-search",
    data() {
      return {

      };
    },
    // 为了增强组件的通用性，我们允许使用者自定义搜索组件的 背景颜色 和 圆角尺寸 。
    // 1. 通过 props 定义 bgcolor 和 radius 两个属性，并指定值类型和属性默认值：
    // 2. 通过属性绑定的形式，为 .my-search-container 盒子和 .my-search-box 盒子动态绑定
    // style 属性
    // 3. 移除对应 scss 样式中的 背景颜色 和 圆角尺寸 
    props: {
      // 背境颜色
      bgcolor: {
        type: String,
        default: "#c00000"
      },
      // 圆角尺寸
      radius: {
        type: Number,
        // 单位是px
        default: 18
      }
    },

    methods: {
      //虚拟搜索点击事件
      searchBoxhandler() {
        // 触发外界通过 @click 绑定的 click 事件处理函数
        this.$emit('click')
      }
    },


  }
</script>

<style lang="scss">
  .my-search-container {
    // 移除背景颜色，由props来控制
    // background-color: #c00000;
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;

    .my-search-box {
      height: 36px;
      background-color: #fff;
      // 移除圆角尺寸，由props来控制
      border-radius: 15px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
