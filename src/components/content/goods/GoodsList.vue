<template>
  <div class="goods-list">
    <goods-list-item
      v-for="(item, index) in goods" :key="index"
      :goods-item="item" class="item">
    </goods-list-item>
  </div>
</template>
<script>
  import GoodsListItem from './GoodsListItem'

  export default {
    components: {
      GoodsListItem
    },
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .goods-list .item {
    width: 48%;
  }
</style>
