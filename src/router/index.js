import Vue from 'vue'
import Router from 'vue-router'
import App from '../App.vue'
import goods from 'components/goods/goods.vue'
import ratings from 'components/ratings/ratings.vue'
import seller from 'components/seller/seller.vue'

Vue.use(Router)

const routes = [
  { path:'/',redirect: '/good',name:'goods',component: goods},
  { path:'/good', name:'goods',component: goods },
  { path:'/ratings', name:'ratings',component: ratings },
  { path:'/seller', name:'seller',component: seller }
]

export default new Router({
    linkActiveClass: 'active',
    routes 
})