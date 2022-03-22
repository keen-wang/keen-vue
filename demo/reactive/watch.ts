import { trigger, EffectFunc, registerEffect, trace } from './index'
/**
 * watch
 * @param source 响应式数据
 * @param callback 回调
 */
export function watch(source: any, callback: Function) {
    let getter = source
    if (typeof getter !== 'function') {
        getter = () => traverse(source)
    }
    let newValue: any, oldValue: any
    const effectFn = registerEffect(() => getter(), {
        scheduler() {
            // 执行副作用函数获取新值
            newValue = effectFn()
            // 对象变化时触发回调
            callback(newValue, oldValue)
            oldValue = newValue
        },
        label: "watchEffect",
        lazy: true
    })
    oldValue = effectFn()
}
// 递归读取对象，跟踪整个对象的变化
function traverse(value: any, seen = new Set()): any {
    if (typeof value !== "object" || value === null || seen.has(value)) return
    // 用seen集合收集已经读取过的object,避免死循环
    seen.add(value)
    // 读取每个key
    for (const key in value) {
        traverse(value[key], seen)
    }
    return value
}