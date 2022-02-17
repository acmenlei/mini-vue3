import { convert, hasChanged } from "../utils";
import { track, trigger } from "./effect";

/**
 * ref的规则：
 * 1. 如果传入的target是一个对象 那么默认走reactive的响应式
 * 2. 如果传入的target是个基本类型数据 那么走set get
 * @param target 
 */
export function ref(target) {
  if (isRef(target)) {
    return target
  }
  // 创建过了
  return new RefImpl(target)
}

export class RefImpl {
  private _rawValue: any;
  private _val: any;
  public __v_isRef = true;

  constructor(val: any) {
    this._rawValue = val // 原始值
    // val可能是一个对象 如果是对象就用reactive包裹
    this._val = convert(val)
  }

  get value() {
    track(this, 'value')
    return this._val
  }

  set value(newVal) {
    if (hasChanged(this._val, newVal)) {
      // 设置的新值可能是一个对象 需要条件判断 转换一下
      this._val = convert(newVal)
      // 新的值设置完成之后再去触发
      // 不然trigger中拿到的还是对应的旧值
      trigger(this, 'value')
    }
  }
}

export function isRef(value) {
  return !!value.__v_isRef
}
// 脱离ref状态
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}