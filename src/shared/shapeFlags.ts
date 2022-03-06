// 组件的类型
export const enum ShapeFlags {
  // 最后要渲染的 element 类型
  ELEMENT = 1,
  // 文本
  TEXT = 1 << 1,
  FRAGMENT = 1 << 2,
  COMPONENT = 1 << 3,
  TEXT_COMPONENT = 1 << 4,
  ARRAY_CHILDREN = 1 << 5,
  TEXT_CHILDREN = 1 << 6,
}

// 用 symbol 作为type的唯一标识
export const Text = Symbol("Text");
export const Fragment = Symbol("Fragment");
