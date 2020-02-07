/**
 * Created by 1 on 2020/2/5.
 */
const getters = {
  cartLength(state) {
    return state.cartList.length
  },
  cartList(state) {
    return state.cartList
  }
}

export default getters
