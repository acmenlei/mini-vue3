import { computed } from "./reactive/computed";
import { watchEffect } from "./reactive/effect";
import { reactive } from "./reactive/reactive";
import { ref, RefImpl } from "./reactive/ref";
import { render } from "./runtime-core/renderer";
import { h } from "./runtime-core/vnode";
// reactive测试
// const obj = (window as any).obj = reactive({
//   name: 'coderlei',
//   age: 18
// })
// watchEffect(() => {
//   console.log("触发", obj.name)
// })
// const runner = watchEffect(() => {
//   console.log("年龄：", obj.age)
// })

// runner()
// ref 测试
// const num: RefImpl = (window as any).num = ref(10)

// watchEffect(() => {
//   console.log("effect输出：", num.value)
// })

// computed 测试
// const num = (window as any).num = ref(10)
// let doubleNum = computed(() => num.value * 2)

// watchEffect(() => {
//   console.log("ref num：", num.value)
// })
// 数组长度
// const arr = (window as any).arr = reactive([1, 2, 3])

// watchEffect(() => {
//   console.log("arr length: ", arr.length)
// })

// const vnode = h('div', { class: 'coderlei' }, [
//   h('p', { class: 'child-ctn' }, '我是子元素内容')
// ])

// render(vnode, document.querySelector("#app"))