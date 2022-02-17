import { ReactiveEffect } from "./effect"

export type ComputedOptions = { lazy?: boolean, scheduler?: () => any }
export type ComputedCallback = () => any

// 计算属性调用
function scheduler() {
  // 只需要更新dirty状态
  // 当我们真正访问计算属性值的时候 就需要重置value的值
  if (!this._dirty) {
    this._dirty = true
  }
}

// 计算属性
export function computed(fn: ComputedCallback) {
  return new ComputedRefImpl(fn)
}
// 实例话计算属性类
export class ComputedRefImpl {
  private effect: ReactiveEffect
  private _dirty: boolean = true
  private _value: any = undefined

  constructor(getter) {
    this.effect = new ReactiveEffect(getter, {
      lazy: true, scheduler: scheduler.bind(this)
    })
  }

  get value() {
    if (this._dirty) {
      // 重新计算值
      this._value = this.effect.run()
      this._dirty = false
    }
    return this._value
  }
  // todo 暂时不能设置计算属性值
  set value(nv) {
    console.warn(` not set computed value: ${nv} `)
  }
}