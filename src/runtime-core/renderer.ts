import { ShapeFlags } from "../shared/shapeFlags"
// import { isString } from "../utils"
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
  const { type, props } = vnode
  const el = document.createElement(type)
  mountProps(el, props)
  mountChildren(vnode, el)
  container.appendChild(el)
}

export function mountTextNode(vnode: VNode, container: HTMLElement) {
  let textNode = document.createTextNode(vnode.children)
  container.appendChild(textNode);
}
export function mountFragment(vnode: VNode, container: HTMLElement) {
  // 碎片不进行创建 只创建子节点
  mountChildren(vnode.children, container);
}
export function mountComponent(vnode: VNode, container: HTMLElement) {

}
export function mountChildren(vnode: any, container: HTMLElement) {
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    mountTextNode(vnode, container)
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    vnode.children.forEach(child => {
      mount(child, container)
    });
  }
}
let domPropsRE = /\[A-Z]^(?:value|checked|selected|muted)$/
export function mountProps(el: HTMLElement, props: object = {}) {
  for (let prop in props) {
    let val = props[prop]
    switch (prop) {
      case "class": el.className = val; break;
      case "style":
        for (let key in val) {
          el.style[key] = val[key]
        }
        break;
      default:
        if (/^on[A-Z]/.test(prop)) {
          let event = prop.slice(2).toLocaleLowerCase()
          el.addEventListener(event, val)
        } else if (domPropsRE.test(prop)) {
          if (val == '' && typeof el[prop] == 'boolean') {
            val = true
          }
          el[prop] = val
        } else {
          if (val == null || val == false) {
            el.removeAttribute(prop)
          } else {
            el.setAttribute(prop, val)
          }
        }
        break;
    }
  }
}
