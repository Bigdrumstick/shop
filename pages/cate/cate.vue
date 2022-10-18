<template>
  <view>
    <view class="scroll-view-container">
      <scroll-view scroll-y="true" class="left-scroll" :style="{height:wh+'px'}">
        <block v-for="(item,i) in cateList" :key="item.cat_id">
          <!--动态 渲染左侧滚动视图默认选中的 -->
          <view :class="['leftscroll-item', i===active? 'active': ''] " @click="activeChange(i)">{{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧滚动视图区域 -->
      <!-- 动态为右侧的 <scroll-view> 组件绑定 scroll-top 属性的值： -->
      <scroll-view scroll-y="true" class="right-scroll" :style="{height: wh+'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="item2.cat_id">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">
            {{item2.cat_name}}
          </view>
          <!-- 三级分类 -->
          <view class="cate-lv3-list">
            <navigator class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="item3.cat_id"
              :url="'/subpkg/goods_list/goods_list?cid=' + item3.cat_id">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text class="cate-lv3-text">{{item3.cat_name}}</text>
            </navigator>

          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 动态计算窗口剩余高度
        // 窗口可用高度=屏幕高度-navigationBar高度-tabBar高度
        wh: 0,
        // 获取分类的列表
        cateList: [],
        // 默认选中第一个
        active: 0,
        // 右侧二级分类列表
        cateLevel2: [],
        // 在 data 中定义 滚动条距离顶部的距离 ：
        scrollTop: 0
      };
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      // console.log(sysInfo);
      this.wh = sysInfo.windowHeight
      this.getCateList()
    },

    methods: {
      // 获取分类列表
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get("/api/public/v1/categories")
        if (res.meta.status !== 200) return uni.$showMsg()
        // console.log(res);
        // 分类列表赋值
        this.cateList = res.message
        // 给二级分类赋值
        this.cateLevel2 = res.message[0].children

      },

      // 为一级item绑定点击事件使选中的item发生变化
      activeChange(i) {
        // console.log(i);
        this.active = i
        // 选中之后二级分类的列表也要发生变化
        this.cateLevel2 = this.cateList[i].children

        //切换一级分类时，动态设置 scrollTop 的值：
        // 让scroll Top的值在0与1之间切换
        // console.log(this.scrollTop);
        this.scrollTop = this.scrollTop === 0 ? 0 : 1
        // console.log(this.scrollTop);
        // 可以简化为如下的代码：
        // this.scrollTop = this.scrollTop ? 0 : 1

      },
      // 点击三级分类跳转到商品列表
      // goGoodsList(item3) {
      //   uni.navigateTo({
      //     url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
      //   })
      // },

    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll {
      width: 120px;

      .leftscroll-item {
        line-height: 60px;
        text-align: center;
        background-color: #f7f7f7;
        font-size: 12px;

        &.active {
          background-color: #fff;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }

    .cate-lv2-title {
      font-size: 12px;
      font-weight: bolder;
      text-align: center;
      padding: 15px 0;
    }

    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;

      .cate-lv3-item {
        width: 33.33%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px;
          // font-weight: bolder;
        }
      }
    }


  }
</style>
