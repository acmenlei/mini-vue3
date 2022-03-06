import { Fragment, ShapeFlags } from "../shared/shapeFlags"
import { isArray, isString } from "../utils";

export type VNode = {
  type: any,
  props: object,
  children: any,
  shapeFlag: any
}

/**
 * @param { string | object | Text | Fragment } type
 * @param { object | null } props 
 * @param { string | Array | null } children 
 */
export function h(type, props = {}, children): VNode {
  let shapeFlag = 0
  if (isString(type)) shapeFlag = ShapeFlags.ELEMENT
  else if (type === Text) shapeFlag = ShapeFlags.TEXT
  else if (type == Fragment) shapeFlag = ShapeFlags.FRAGMENT
  else shapeFlag = ShapeFlags.COMPONENT

  if (isString(children)) {
    shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (isArray(children)) {
    shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  return {
    type,
    props,
    children,
    shapeFlag
  }
}

// export function createVNode(
//   type: any,
//   props?: any,
//   children?: string | any[]
// ) {
//   // type 可能是string 也可能是对象
//   // 如果是对象的话， 那么就是用户设置的options export default { ... }
//   // type为string的时候
//   // createVNode('div)
//   // type为组件对象的时候
//   // createVNode(App)
//   const vnode = {
//     el: null,
//     component: null,
//     key: props?.key,
//     type,
//     props: props || {},
//     children,
//     shapeFlag: getShapeFlag(type)
//   }

//   // 基于children再次设置flag
//   if (isArray(children)) {
//     // 子元素为DOM元素
//     vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
//   } else if (isString(children)) {
//     // 子元素为文本节点
//     vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
//   }
// }
// export function normalizeChildren(vnode, children) {
//   if (isObject(children)) {
//     if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
//       // 如果是 element 类型的话，那么 children 肯定不是 slots
//     } else {
//       // 这里就必然是 component 了,
//       vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
//     }
//   }
// }
// // 用 symbol 作为type的唯一标识
// export const Text = Symbol("Text");
// export const Fragment = Symbol("Fragment");



// // 基于 type 来判断是什么类型的组件
// function getShapeFlag(type: any) {
//   return typeof type === "string"
//     ? ShapeFlags.ELEMENT // div
//     : ShapeFlags.STATEFUL_COMPONENT; // custom cnpt name
// }
