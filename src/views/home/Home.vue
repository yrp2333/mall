<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 class="tab-control"
                 @tabClick="tabClick"
                 ref="tabControl1" v-show="isTabFixed"></tab-control>
    <scroll class="content"
             ref="scroll"
             :probe-type="3"
             @scroll="contentScroll"
             :pull-up-load="true"
             @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <home-feature-view></home-feature-view>
      <tab-control :titles="['流行', '新款', '精选']"
                     @tabClick="tabClick"
                     ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowContent"></back-top>
  </div>
</template>
<script>
  import HomeSwiper from './childrenComps/HomeSwiper'
  import HomeRecommendView from './childrenComps/HomeRecommendView'
  import HomeFeatureView from './childrenComps/HomeFeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/tabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import GoodsListItem from 'components/content/goods/GoodsListItem'
  import Scroll from 'components/common/scroll/Scroll'
  import backTop from 'components/content/backTop/backTop'

  import {getHomeMultidate, getHomeGoods} from 'network/home'
  import {debounce} from 'common/debounce'
  import {itemListenerMixin} from 'common/mixin'


  export default {
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommendView,
      HomeFeatureView,
      TabControl,
      GoodsList,
      GoodsListItem,
      Scroll,
      backTop
    },
    data() {
      return {
        result: null,
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowContent: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMulitdate()
      //2.请求商品数据
      this.getHomeGoods('pop')

      this.getHomeGoods('new')

      this.getHomeGoods('sell')

    },
    mounted() {
      /*//监听item中图片加载完成
      //this.$refs.scroll.refresh对这个函数进行防抖操作
      const refresh = debounce(this.$refs.scroll.refresh, 200)

      //对监听的事件进行保存
      this.itemImgListener = () => {
        //console.log('-----')
        refresh()
      }
      this.$bus.$on('itemImageLoad', this.itemImgListener)
*/
      //赋值
      //获取tabControl中的offsetTop
      //所有组件都有一个属性$el:用于获取组件中的元素
      //this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    },
    methods: {
      /*
      * 事件监听相关的方法
      * */
      tabClick(index) {
        //console.log(index)
        switch(index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        //让两个tabControl保持一致
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        //this.$refs.scroll.scrollTo(0, 0)
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        //1.判断BackTop是否显示
        this.isShowContent = -position.y > 1000

        //2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        //console.log(this.tabOffsetTop);
      },
      /*
      * 网络请求
      * */
      getHomeMulitdate() {
        getHomeMultidate().then(res => {
          //console.log(res)
          this.result = res
          this.banners = res.data.data.banner.list
          this.recommends = res.data.data.recommend.list
      })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          //console.log(res)
          this.goods[type].list.push(...res.data.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      }
    },
    destroyed() {
      //console.log('home destroyed');
    },
    activated() {
      //console.log('activated');
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //console.log('deactivated');
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      //2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }
  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }

  /*.fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  }*/


</style>
