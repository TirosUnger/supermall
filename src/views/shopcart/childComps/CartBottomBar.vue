<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"
      :is-checked="isSelectAll"
      @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计：￥{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton.vue'

  import {mapGetters} from 'vuex'

  export default {
    name: 'CartBottomBar',
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if(this.cartList.length !== 0) {
          // return !(this.cartList.filter(item => !item.checked).length)
          return !this.cartList.find(item => !item.checked)
        }else {
          return false
        }
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) { // 全部选中
          this.cartList.forEach(item => item.checked = false)
        } else { // 部分或全部不选中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 2000)
        }
      }
    }
  }
</script>

<style scoped>
  @import url("~assets/css/base.css");

  .bottom-bar {
    position: fixed;
    display: flex;
    height: 40px;
    bottom: 49px;
    right: 0;
    left: 0;
    background-color: #eee;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }

  .price{
    margin-left: 20px;
    align-items: center;
    display: flex;
    flex: 1;
  }

  .calculate {
    padding: 0px 15px;
    align-items: center;
    display: flex;
    background-color: var(--color-tint);
    text-align: center;
    color: #fff;
  }
</style>
