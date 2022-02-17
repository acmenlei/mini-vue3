import { extend } from "../utils"
import { ComputedOptions } from "./computed"
import { createDep } from "./dep"

// 存储Effect 解决Effect嵌套的问题
let stackEffect: ReactiveEffect[] = []
let activeEffect: ReactiveEffect | undefined
// 用于收集依赖
export class ReactiveEffect {
  private _fn: any
  deps = []
  private active: boolean = true
  _options: ComputedOptions
  public onStop?: () => void

  constructor(fn, options: ComputedOptions = {}) {
    this._fn = fn
    this._options = options
    if (!options.lazy) {
      this.run()
    }
  }
  run() {
    // 当前的Effect被stop了 不用进行依赖收集了
    if (!this.active) {
      return this._fn();
    }
    stackEffect.push(this)
    activeEffect = this

    const result = this._fn()

    stackEffect.pop()
    // 重置当前活跃的Effect
    activeEffect = stackEffect[stackEffect.length - 1]
    return result
  }
  stop() {
    // 清除依赖
    if (!this.active) return
    cleanupEffect(this)
    this.active = false
    if (this.onStop) {
      // 如果该事件回调存在的话
      // 就调用停止Effect响应的事件回调
      this.onStop()
    }
  }
}
// 清除依赖关系
function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  });
}

export function watchEffect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn)
  // 把用户传递过来的值合并到effect上去
  extend(_effect, options)
  // _effect.run();
  // const runner = _effect.run.bind(_effect)
  // runner.effect = _effect
  // 返回该函数给外部使用
  return () => {
    _effect.run()
    _effect.stop()
  }
}

export type TargetKeyMap = Map<string | symbol, Set<ReactiveEffect>>

const targetMap = new Map()
// 依赖追踪
export function track(target: object, key: string | symbol) {
  // 当且仅当当前Effect存在才去建立依赖关系
  if (!activeEffect) {
    return
  }
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }
  let targetKeyMap: TargetKeyMap = targetMap.get(target);
  // 再从对象中去获取当前key的deps依赖

  if (!targetKeyMap.has(key)) {
    targetKeyMap.set(key, createDep())
  }
  let deps = targetKeyMap.get(key)

  // 当前key与Effect建立依赖关系
  trackEffect(deps)
}

function trackEffect(deps: Set<ReactiveEffect>) {
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect)
    // 当前Effect依赖于哪些key
    activeEffect.deps.push(deps)
  }
}

// 触发依赖更新
export function trigger(target: object, key: string | symbol) {
  let targetKeyMap: TargetKeyMap = targetMap.get(target)
  if (!targetKeyMap) {
    return
  }
  let deps = targetKeyMap.get(key)
  if (!deps) {
    return
  }
  triggerEffect(deps)
}

export function triggerEffect(deps: Set<ReactiveEffect>) {
  // 执行run方法 重新执行effect中的函数
  deps.forEach((effect: ReactiveEffect) => {
    // 如果是计算属性的话 直接更新dirty值就可
    // 否则就需要触发effect函数
    if (effect._options.scheduler) {
      effect._options.scheduler()
    } else {
      effect.run()
    }
  })
}