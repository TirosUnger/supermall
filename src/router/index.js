import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from "views/home/Home.vue"
// import Category from "views/category/Category.vue"
// import Profile from "views/profile/Profile.vue"
// import Shopcart from "views/shopcart/Shopcart.vue"

const Home = () => import("views/home/Home.vue")
const Category = () => import("views/category/Category.vue")
const Profile = () => import("views/profile/Profile.vue")
const Shopcart = () => import("views/shopcart/Shopcart.vue")

// 1.安装插件
Vue.use(VueRouter)

// 2.创建router
const routes = [
  {
    path: "",
    redirect: "/home"
  },
  {
    path: "/home",
    component: Home
  },
  {
    path: "/category",
    component: Category
  },
  {
    path: "/profile",
    component: Profile
  },
  {
    path: "/shopcart",
    component: Shopcart
  }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})

// 3.导出router
export default router
