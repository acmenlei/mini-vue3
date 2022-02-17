import { ShapeFlags } from "../shared/shapeFlags"
import { VNode } from "./vnode"

// 渲染虚拟DOM节点到容器
export function render(vnode: VNode, container: HTMLElement) {
  mount(vnode, container)
}

function mount(
  vnode: VNode,
  container: HTMLElement
) {
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    mountElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.TEXT) {
    mountTextNode(vnode, container)
  } else if (shapeFlag & ShapeFlags.FRAGMENT) {
    mountFragment(vnode, container)
  } else {
    mountComponent(vnode, container)
  }
}

export function mountElement(vnode: VNode, container: HTMLElement) {
  const { type, props, children } = vnode
  const el = document.createElement(type)
  mountProps(el, props)
  mountChildren(vnode, el)
}

export function mountTextNode(vnode: VNode, container: HTMLElement) { }
export function mountFragment(vnode: VNode, container: HTMLElement) { }
export function mountComponent(vnode: VNode, container: HTMLElement) { }
export function mountChildren(vnode: VNode, el: HTMLElement) {
  
}
export function mountProps(el: HTMLElement, props: object = {}) {

}
