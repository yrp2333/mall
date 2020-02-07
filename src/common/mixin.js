/*
 * Created by 1 on 2020/2/1.
 */

import {debounce} from 'common/debounce'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    //监听item中图片加载完成
    //this.$refs.scroll.refresh对这个函数进行防抖操作
    this.refresh = debounce(this.$refs.scroll.refresh, 200)

    //对监听的事件进行保存
    this.itemImgListener = () => {
      //console.log('-----')
      this.refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
}

export const backTopMixin = {
  data: function () {
    return {
      showBackTop: false
    }
  },
  methods: {
    backTop: function () {
      this.$refs.scroll.scrollTo(0, 0, 300);
      //console.log('-------');
    }
  }
}
