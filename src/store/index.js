/**
 * Created by 1 on 2020/2/4.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

//1.安装插件
Vue.use(Vuex)

//2.创建Store对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    //mutations唯一的目的是修改state中的状态
    //mutations中的每个方法尽可能完成的事件比较单一一点
    addCounter(state, payload) {
      payload.count++
    },
    addToCart(state, payload) {
      payload.checked = true
      state.cartList.push(payload)
    }
  },
  actions: {
    addCart(context, payload) {
      //payload新添加的商品
      let oldProduct = null
      for(let item of context.state.cartList) {
        if(item.iid === payload.iid) {
          oldProduct = item
        }
      }

      //2.判断oldProduct
      if(oldProduct) {
        //oldProduct.count += 1
        context.commit('addCounter', oldProduct)
      } else {
        payload.count = 1
        //context.state.cartList.push(payload)
        context.commit('addToCart', payload)
      }
    }
  },
  getters
})

//3.挂载vue实例上
export default store

