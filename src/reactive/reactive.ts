import { hasChanged, isArray, isObject } from "../utils";
import { track, trigger } from "./effect";
import { convert } from "../utils";

export const enum ReactiveFlags {
  IS_REACTIVE = '__isReactive'
}

// 存储已经代理过的对象 防止重复代理 
const proxyMap = new WeakMap()
/**
 * @param origin 需要处理成响应式的对象
 * @returns 
 */
export function reactive(origin: any) {
  if (!isObject(origin)) {
    console.error('the value is a null');
  }
  // 防止重复响应式处理
  if (isReactive(origin)) {
    return origin
  }
  // 防止重复进行代理
  if (isProxy(origin)) {
    return proxyMap.get(origin)
  }
  const proxy = new Proxy(origin, {
    set(origin, key, val, receiver) {
      // if (isArray(origin) && val == 0) {
      //   return true
      // }
      // 旧值
      let oldVal = origin[key]
      // 新旧值比较 如果新值和旧值不同 那么就去触发key收集的effect
      if (hasChanged(val, oldVal)) {
        // 新的val有可能是一个对象 需要转换一下
        let newVal = convert(val)
        let res = Reflect.set(origin, key, newVal, receiver)
        trigger(origin, key)
        return res
      }
    },
    get(origin, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true
      }
      let res = Reflect.get(origin, key, receiver)
      // 收集依赖effect
      track(origin, key)
      return res
    }
  })
  proxyMap.set(origin, proxy)
  return proxy
}

export function isReactive(target) {
  return !!target[ReactiveFlags.IS_REACTIVE]
}

export function isProxy(target) {
  return proxyMap.has(target)
}