<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <view class="search-box">
      <my-search @click="goToSearch"></my-search>
    </view>
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular
      indicator-active-color="#C00000">
      <swiper-item v-for="(item,index) in swipersList" :key="item.id">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
          <image :src="item.image_src" />
        </navigator>
      </swiper-item>

    </swiper>
    <!-- 导航分类区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(nav,i) in navList" :key="i" @click="goCate(nav)">
        <image :src="nav.image_src" class="nav-img"></image>
      </view>

    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item,i) in floorList" :key="i">
        <!-- 楼层的title部分 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层的图片部分 -->
        <view class="flor-img-box">
          <!-- 楼层图片的左边放大的图片 -->
          <navigator class="left-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}"
              mode="widthFix"></image>
          </navigator>
          <!-- 楼层图片区域的右侧的图片 -->
          <view class="right-box">
            <navigator class="right-item" v-for="(img,i2) in item.product_list" :key="i2" v-if="i2!==0" :url="img.url">
              <image :src="img.image_src" :style="{width:img.image_width+'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>


        </view>

      </view>

    </view>
  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    data() {
      return {
        // 轮播图列表
        swipersList: [],
        // 分类导航数据列表
        navList: [],
        // 楼层数据列表
        floorList: []
      };
    },
    // 在onload生命周期函数中调用轮播图的方法
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      // 获取轮播图的数据的方法
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get("/api/public/v1/home/swiperdata")
        // console.log(res);
        this.swipersList = res.message
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
      },
      // 获取导航分类列表
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get("/api/public/v1/home/catitems")
        // console.log(res);
        this.navList = res.message
        if (res.meta.status !== 200) return uni.$showMsg()
      },
      // 点击跳转到分类页面，
      goCate(nav) {
        if (nav.name === "分类") {
          uni.switchTab({
            url: "/pages/cate/cate"
          })
        }
      },
      // 获取楼层数据列表
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get("/api/public/v1/home/floordata")
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()
        // 双层forEach循环得url。处理url
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split("?")[1]
          })
        })
        this.floorList = res.message
      },

      // 在 home 首页定义如下的事件处理函数

      goToSearch() {
        uni.navigateTo({
          url: "/subpkg/search/search"
        })
      }
    },


  }
</script>

<style lang="scss">
  // 通过如下的样式实现吸顶的效果：
  .search-box {
    // // 设置定位效果为“吸顶”
    position: sticky;
    // 定位吸顶位置
    top: 0;
    // 层级以防被覆盖// 提高层级，防止被轮播图覆盖
    z-index: 999999;
  }

  ;

  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  ;

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15rpx 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  ;

  .floor-list {
    .floor-title {
      width: 100%;
      height: 60rpx;
      display: flex;
    }

    .flor-img-box {
      display: flex;
      padding-left: 10rpx;

      .right-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    }


  }

  ;
</style>
