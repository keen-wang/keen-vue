import { trigger, EffectFunc, registerEffect, track } from './createReactive'
interface WatchOptions {
    immediate?: boolean,
    flush?: "pre" | "post" | "sync" // 立即执行时机
}
/**
 * watch
 * @param source 响应式数据
 * @param callback 回调
 */
export function watch(source: any, callback: Function, options?: WatchOptions) {
    let getter = source
    if (typeof getter !== 'function') {
        getter = () => traverse(source)
    }
    // 在watch函数内添加cleanup保存上一次过期回调
    let cleanup: Function | undefined = undefined
    function onInvalidate(fn: Function) {
        cleanup = fn
    }

    let newValue: any, oldValue: any
    const job = () => {
        // 执行副作用函数获取新值
        newValue = effectFn()
        // 触发上一个函数的过期回调
        if(cleanup) {
            cleanup()
            cleanup = undefined
        }
        // 对象变化时触发回调
        callback(newValue, oldValue, onInvalidate)
        oldValue = newValue
    }
    const effectFn = registerEffect(() => getter(), {
        scheduler: ()=>{
            if(options?.flush === 'post') {
                const p = Promise.resolve()
                p.then(job)
            } else {
                job()
            }
        },
        label: "watchEffect",
        lazy: true
    })
    // 当immediate为true,立即执行回调，将初值回调出去
    if (options?.immediate) {
        job()
    } else {
        oldValue = effectFn()
    }
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