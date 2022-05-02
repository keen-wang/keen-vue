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

export function proxyRefs(target: any) {
    return new Proxy(target, {
        get(target, key, receiver) {
            const value = Reflect.get(target, key, receiver)
            // 自动脱 ref 实现：读取值是ref,则返回 value 
            return value.__v_isRef ? value.value : value
        },
        set(target, key, newVal, receiver) {
            const value = target[key]
            if (value.__v_isRef) {
                value.value = newVal
                return true
            }
            return Reflect.set(target, key, newVal, receiver)
        }
    })
}