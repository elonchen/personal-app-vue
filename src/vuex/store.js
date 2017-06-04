/**
 * @author:SheldonYee
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    Selectfoods : [],//被选中的各种商品和价格[{ desc:food1,price:10,count:2 }]
    totalPrice: 0,//总价
    totalCount:0 //购买总数
  },
  mutations:{
    addPrice (state,Price){
        state.totalPrice += Price;
    },
    decreasePrice (state,Price){
        state.totalPrice -= Price;
    },
    addCount (state,count){
        state.totalCount += count;
    },
    decreaseCount (state,count){
      state.totalCount -= count;
    },
    selectFoods (state,foodsArr){
      state.Selectfoods = foodsArr;
    },
    empty (state) {
      state.totalPrice = 0;
      state.totalCount = 0;
      state.Selectfoods.forEach(food=>{
        food.count = 0;
      })
      state.Selectfoods = [];
    }
  }
})

export default store