import { reactive } from "../reactive/reactive"

export function isObject(origin: any) {
  return typeof origin == 'object' && origin != null
}

export function isArray(origin: any) {
  return Array.isArray(origin)
}

export function isBoolean(target: any) {
  return typeof target === 'boolean'
}

export function isString(target: any) {
  return typeof target === 'string'
}

export function hasChanged(nval: any, oval: any) {
  // 处理NaN的情况
  if (nval !== oval) {
    // 判断是否为NAN
    if (Number.isNaN(nval) && Number.isNaN(oval)) {
      return false
    }
    return true
  }
}

export function convert(val) {
  return isObject(val) ? reactive(val) : val
}

export const extend = Object.assign