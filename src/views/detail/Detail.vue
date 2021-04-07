<template>
  <div id="detail">
    <detail-nav-bar ref="navbar" class="detail-nav" @titleClick="titleClick"/>
    <scroll class="wrapper"
    ref="scroll"
    :probe-type="3"
    @scroll="contentScroll">
      <!-- 属性：topImages 传入值：top-images -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info
      class="goods-info"
      :detail-info="detailInfo"
      @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <good-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar.vue"
  import DetailSwiper from "./childComps/DetailSwiper.vue"
  import DetailBaseInfo from "./childComps/DetailBaseInfo.vue"
  import DetailShopInfo from "./childComps/DetailShopInfo.vue"
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue"
  import DetailParamInfo from "./childComps/DetailParamInfo.vue"
  import DetailCommentInfo from "./childComps/DetailCommentInfo.vue"
  import DetailBottomBar from "./childComps/DetailBottomBar.vue"

  import Scroll from "components/common/scroll/Scroll.vue"
  import GoodList from "components/content/goods/GoodsList.vue"

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail.js"
  // import {debounce} from "common/utils.js"
  import {itemListenerMixin, backTopMixin} from "common/mixin.js"

  import {mapActions} from 'vuex'
  // import Toast from 'components/common/toast/Toast.vue'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodList,
      // Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [], //各模块顶部的Y值
        getThemeTopY: null, //防抖函数
        isNavbarPuls: false, //scroll高度是否包括navbar高度
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result
        // 1.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.取出评论的信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }


        /* // 1.第一次获取，值不对
        // 值不对的原因：this.$refs.params.$el压根没有渲染
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        console.log(this.themeTopYs)


        this.$nextTick(() => {
          // 2.第二次获取，值不对
          // 值不对的原因：图片没有计算在内
          // 根据最新的数据，对应的DOM是已经被渲染出来
          // 但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片)
          // offsetTop值不对的时候，都是因为图片的问题
          this.themeTopYs = []

          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.param.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

          console.log(this.themeTopYs)
        }) */
      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
    },
    mounted() {
      // 解决最先滑动后navbar不计入在scroll滑动高度的情况
      /* this.$refs.scroll.scroll.on('scrollStart', () => {
        if(!this.isNavbarPuls) {
          for(let i = 1; i < this.themeTopYs.length; i++) {
            this.themeTopYs[i] -= this.$refs.navbar.$el.offsetHeight
          }
          this.isNavbarPuls = true
        }
      }) */
    },
    destroyed() {
      // 取消全局事件的监听
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()

        //给themeTopYs赋值
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)

        // 解决最先滑动后navbar不计入在scroll滑动高度的情况
        /* if(!this.isNavbarPuls) {
          for(let i = 1; i < this.themeTopYs.length; i++) {
            this.themeTopYs[i] -= this.$refs.navbar.$el.offsetHeight
          }
          this.isNavbarPuls = true
        } */

        // 防止点击navbar过快出现undefind不能定位到位置，重新定位一下
        if(this.$refs.navbar.currentIndex !== 0){
          this.titleClick(this.$refs.navbar.currentIndex)
        }

        // console.log(this.themeTopYs)
      },
      titleClick(index) {
        // console.log(index, this.themeTopYs[index])
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y

        // 2.positionY和主题中的值进行对比
        // [0, 8681, 9661, 9898]
        // positionY在 0 和 8681 之间，index = 0
        // positionY在 =8681 和 9661 之间，index = 1
        // positionY在 9661 和 9898 之间，index = 2
        // positionY大于等于 9898 时，index = 3
        let length = this.themeTopYs.length
        for(let i = 0; i < length; i++) {
          // console.log(i)
          /* if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
            this.currentIndex = i
            this.$refs.navbar.currentIndex = this.currentIndex
          } */

          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i
            this.$refs.navbar.currentIndex = this.currentIndex
          }
        }

        // 3.是否显示回到顶部
        this.listenShowBackTop(position)
      },
      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 2.将商品添加到购物车里
        // this.$store.commit('addCart', product)

        this.addCart(product).then(res => {
          /* this.message = res
          this.show = true

          setTimeout(() => {
            this.show = false
            this.message = ''
          }, 1500) */

          this.$toast.show(res, 1500)
        })

        /* this.$store.dispatch('addCart', product).then(res => {
          console.log(res)
        }) */

        // console.log($store.state.cartList)
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .wrapper {
    height: calc(100% - 44px - 49px);
    position: fixed;
    bottom: 49px;
  }

  .goods-info {
    position: relative;
  }
</style>
