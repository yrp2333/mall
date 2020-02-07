<template>
  <div id="shop-item">
    <div class="item-selector">
      <check-button @checkBtnClick="checkBtnClick" :checked="itemInfo.checked"></check-button>
    </div>
    <div class="item-img">
      <img :src="itemInfo.image" alt="商品图片">
    </div>
    <div class="item-info">
      <div class="item-title">{{itemInfo.title}}</div>
      <div class="item-desc">商品描述: {{itemInfo.desc}}</div>
      <div class="info-bottom">
        <div class="item-price left">¥{{itemInfo.price}}</div>
        <div class="item-count right">x{{itemInfo.count}}</div>
      </div>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  export default {
    props: {
      itemInfo: {
        type: Object
      }
    },
    components: {
      CheckButton
    },
    methods: {
      checkBtnClick() {
        this.itemInfo.checked = !this.itemInfo.checked
      }
    }
  }
</script>

<style scoped>
  #shop-item {
    height: 110px;
    width: 100%;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }
  .item-selector {
    float: left;
    width: 10%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .item-img {
    float: left;
    width: 25%;
  }
  .item-img img {
    width: 80px;
    height: 100px;
    display: block;
    border-radius: 5px;
  }
  .item-info {
    float: right;
    width: 65%;
    font-size: 17px;
    color: #333;
    position: relative;
  }
  .item-title, .item-desc{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 15px;
  }
  .item-desc {
    font-size: 14px;
  }
  .info-bottom {
    margin-top: 10px;
    position: absolute;
    bottom: -33px;
    left: 1px;
    right: 10px;
  }
  .info-bottom .item-price {
    color: orangered;
  }
</style>
