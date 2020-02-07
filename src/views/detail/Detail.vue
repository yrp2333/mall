<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imgLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="param"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommendList" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backTop" class="back-top" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt="">
    </back-top>
  </div>
</template>
<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import BackTop from 'components/content/backTop/backTop'
  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, Goods, Shop, GoodsParam, CommentInfo, getRecommend} from 'network/detail'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'
  import {debounce} from 'common/debounce'

  export default {
    name: 'Detail',
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommendList: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    mixins: [itemListenerMixin, backTopMixin],
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid

      //2.根据id请求详情数据
      getDetail(this.iid).then(res => {
        //1.获取顶部的图片轮播数据
        //console.log(res)
        const data = res.data.result
        this.topImages = data.itemInfo.topImages

        //2.获取商品的数据
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        //4.保存商品的详细数据
        this.detailInfo = data.detailInfo

        //5.获取参数的信息paramInfo
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        //console.log(this.paramInfo);

        //6.取出评论信息
        this.commentInfo = new CommentInfo(data.rate)

        /*this.$nextTick(() => {
          /!*根据最新的数据，对应的DOM是已经被渲染出来
          但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
          offsetTop值不对的时候，都是因为图片的问题*!/
          this.themeTopYs = []

          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.param.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          console.log(this.themeTopYs);
        })*/
    })

      //3.请求推荐数据
      getRecommend().then(res => {
        //console.log(res)
        this.recommendList = res.data.data.list
      })

      //4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        //console.log('------');
      }, 100)
    },
    methods: {
      imageLoad() {
        /*this.$refs.scroll.refresh()*/
        this.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        //console.log(index)
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        this.showBackTop = -position.y > 1000
        //1.获取y值
        const positionY = -position.y

        //2.positionY和主题中的值进行比较
        for (let i = 0; i < this.themeTopYs.length - 1; i++) {
          let iPos = this.themeTopYs[i];
          /**
           * 判断的方案:
           *  方案一:
           *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
           *    优点: 不需要引入其他的内容, 通过逻辑解决
           *    缺点: 判断条件过长, 并且不容易理解
           *  方案二:
           *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
           *    优点: 简洁明了, 便于理解
           *    缺点: 需要引入一个较大的int数字
           * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
           * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
           */
          if (positionY >= iPos && positionY < this.themeTopYs[i+1]) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      },
      addToCart() {
        //console.log('------');
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        //console.log(product);

        //2.将商品添加到购物车里
        //mutations的方法: this.$store.commit('addCart', product)
        this.$store.dispatch('addCart', product)
      }
    },
    mounted() {

    },
    updated() {

    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    background-color: #fff;
    z-index: 9;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    /*height: calc(100% - 44px);*/
    position: absolute;
    top: 44px;
    bottom: 60px;
  }


</style>
