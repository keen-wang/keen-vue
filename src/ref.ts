import { reactive } from './reactive'
// 原始数据的响应式
export function ref(val: any) {
    // wrapper 包裹传进来的值
    const wrapper = {
        value: val
    }
    // 定义属性标识 ref 数据
    Object.defineProperty(wrapper, "__v_isRef", {
        value: true
    })
    return reactive(wrapper)
}
export function toRef(obj: any, key: string): any {
    const wrapper = {
        get value() {
            return obj[key]
        },
        set value(val) {
            obj[key] = val
        }
    }
    // 定义属性标识 ref 数据
    Object.defineProperty(wrapper, "__v_isRef", {
        value: true
    })
    return wrapper
}

export function toRefs(obj: any): any {
    const ref: any = {}
    for (const key in obj) {
        // 逐个转换 toRef
        ref[key] = toRef(obj, key)
    }
    return ref
}