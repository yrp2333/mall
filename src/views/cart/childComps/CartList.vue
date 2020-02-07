<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item
        v-for="(item, index) in cartList"
        :itemInfo="item"
        :key="index"/>
    </scroll>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'

  export default {
    components: {
      Scroll,
      CartListItem
    },
    activated() {
      this.$refs.scroll.refresh()
    },
    computed: {
      ...mapGetters(['cartList'])
    }
  }
</script>

<style scoped>
  .cart-list {
    position: absolute;
    top: 44px;
    bottom: 49px;
    width: 100%;
    overflow: hidden;
  }

  .content {
    height: 100%;
  }
</style>
