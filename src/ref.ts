import {reactive} from './reactive'
// 原始数据的响应式
export function ref(val: any) {
    // wrapper 包裹传进来的值
    const wrapper = {
        value: val
    }
    // 定义属性标识 ref 数据
    Object.defineProperty(wrapper,"__v_isRef", {
        value: true
    })
    return reactive(wrapper)
}