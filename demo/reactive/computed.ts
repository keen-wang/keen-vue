import {trigger, EffectFunc,registerEffect,trace} from './index'

/**
 * 实现computed函数
 * 只有当读取计算属性的值时才会去执行副作用函数
 */
 export function computed(getter: EffectFunc): { value: any } {
    //value 用于缓存上一次取到的值
    let value: any
    // dirty 标识是否需要重新计算属性
    let dirty = true
    // 计算副作用函数执行次数
    let count = 0
    const effectFn = registerEffect(getter, {
        lazy: true,
        label: "computedEffect",
        scheduler() {
            // 每次触发副作用函数时不执行副作用函数，将dirty标明被修改，下次获取值时执行副作用函数
            dirty = true
            // 将obj设为响应式： 属性值发生改变时触发trigger
            trigger(obj, "value")
        }
    })
    const obj = {
        get value() {
            if (dirty) {
                value = effectFn()
                console.warn('[computed] effectFn work!', count++);
                // dirty 设置false, 利用缓存减少副作用函数执行次数
                dirty = false
            }
            // 将obj设为响应式： 属性值被读取时触发trace
            trace(obj, 'value')
            return value;
        }
    }
    return obj
}
