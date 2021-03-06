/**
 * Created by 1 on 2020/1/17.
 */
import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000/api/hy',
    timeout: 5000
  })

  //2.axios的拦截器
  //2.1.请求拦截的作用.
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    //console.log(err)
  })

  //3.发送真正的网络请求
  return instance(config)
}
