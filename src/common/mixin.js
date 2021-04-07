import {debounce} from "./utils.js"
import BackTop from "components/content/backTop/BackTop.vue"

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    // 1.监听item中图片加载完成
    let newRefresh = debounce(this.$refs.scroll.refresh, 100)
    this.itemImgListener = () => {
      // console.log('imageloadfinish')
      // this.$refs.scroll && this.$refs.scroll.refresh()
      newRefresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    // console.log("我是混入中的内容")
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}