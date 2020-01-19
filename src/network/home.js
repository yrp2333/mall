/**
 * Created by 1 on 2020/1/17.
 */
import {request} from './request'

export function getHomeMultidate() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}
