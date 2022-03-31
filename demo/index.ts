import { registerEffect, reactive } from '../src'

const proto: any = {
    name: "Proto",
    id: 99
}
// 原始数据
const originData: any = {
}
// 原始数据代理
const child = reactive(originData)
const parent = reactive(proto)

// 设置child的原型为parent
Object.setPrototypeOf(child, parent)

registerEffect(()=>{
    console.log('registerEffect', child.id)
})

setTimeout(() => {
    console.log('one second later',);
    setTimeout(() => {
        child.id ++
        // 应该只触发一次副作用函数执行
    }, 1000);
}, 1000);