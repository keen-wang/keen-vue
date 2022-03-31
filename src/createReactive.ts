
export interface EffectFuncOptions {
    label: string,
    scheduler?: (fn: Function) => void,
    lazy?: boolean
}
export class EffectFunc extends Function {
    constructor() {
        super()
    }
    options?: EffectFuncOptions = { label: "" }
    deps?: Set<Function>[]
}

export enum TriggerType {
    Add = 0,
    Delete,
    Set
}

/**
 *  存储副作用函数的集合： WeakMap 将闭包作用域中的对象强引用，避免影响垃圾回收。
 */
const bucket: WeakMap<object, Map<string | Symbol, Set<Function>>> = new WeakMap()
/**
 * for in 遍历对象 key 绑定的 _iterateKey
 */
let _iterateKey = Symbol()

/**
 *  数据响应式
 * 拦截对象属性读取的几种方式：
 * 1. 访问属性 obj.foo
 * 2. 判断对象或原型上是否存在给定的 key : key in obj
 * 3. for in 遍历对象的 key
 */
export function createReactive<T extends object>(origin: T, isShallow = false): T {
    return new Proxy(origin, {
        get(target, key, receiver) {
            // raw 获取原始对象
            if (key === "raw") return target

            track(target, key)

            // 通过 receiver 来读取属性值 getter 中的 this 也变为 receiver 即代理对象。
            const res = Reflect.get(target, key, receiver)

            // 深度响应式
            if (!isShallow) {
                // 按需将读取的对象属性也转换成响应式对象
                if (typeof res === "object" && res !== null) {
                    return createReactive(res, isShallow)
                }
            }
            // 浅响应
            return res


        },
        set(target, key, value, receiver) {
            // @ts-ignore
            const oldValue = target[key]
            const type = Object.prototype.hasOwnProperty.call(target, key) ? TriggerType.Set : TriggerType.Add
            //  设置新值
            Reflect.set(target, key, value, receiver)
            // 判断 receiver 是不是 target 的代理对象，如果不是，那就是子对象触发的set,不触发副作用函数
            if (receiver.raw === target) {
                // 判断新旧的值不一样，而且都不是 NaN 时触发响应
                if (value !== oldValue && (value === value || oldValue === oldValue)) {
                    trigger(target, key, type)
                }
            }
            return true
        },
        has(target, key) {
            track(target, key)
            return Reflect.has(target, key)
        },
        ownKeys(target) {
            track(target, _iterateKey)
            return Reflect.ownKeys(target)
        },
        deleteProperty(target, key) {
            // 检查是否拥有属性
            const hasKey = Object.prototype.hasOwnProperty.call(target, key)
            const result = Reflect.deleteProperty(target, key)
            if (hasKey && result) {
                trigger(target, _iterateKey, TriggerType.Delete)
            }
            return result
        }
    })
}
/** 追踪属性 */
export function track(target: any, key: string | symbol) {
    if (!activeEffect) return
    console.warn('[track] Bind key and effect: ', key, activeEffect?.options?.label);
    let depsMap = bucket.get(target)
    if (!depsMap) {
        depsMap = new Map()
        bucket.set(target, depsMap)
    }
    let deps = depsMap.get(key)
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }

    // 将副作用函数收集到目标对象对应的属性下面的依赖集合 target.key.deps
    deps.add(activeEffect)
    // 将依赖集合对象添加到 activeEffect.deps
    if (!activeEffect.deps) {
        activeEffect.deps = [deps]
    } else {
        activeEffect.deps.push(deps)
    }
}
/** 触发副作用函数 */
export function trigger(target: any, key: string | symbol, type: TriggerType = TriggerType.Set) {
    // 获取副作用函数
    const depMap = bucket.get(target)
    if (!depMap) return
    const effects = depMap.get(key)
    const effectsToRun: Set<Function> = new Set()
    effects?.forEach(item => {
        //！！！ 组织副作用函数内触发trigger导致无限递归。
        if (activeEffect !== item) {
            effectsToRun.add(item)
        }
    })
    if (type === TriggerType.Add || type === TriggerType.Delete) {
        const iterateEffects = depMap.get(_iterateKey)
        iterateEffects && iterateEffects.forEach(item => {
            //！！！ 组织副作用函数内触发trigger导致无限递归。
            if (activeEffect !== item) {
                effectsToRun.add(item)
            }
        })
    }
    effectsToRun.forEach((fn: any) => {
        if (fn.options?.scheduler) {
            // 可通过 scheduler 自行决定副作用函数执行的次数和时机
            fn.options?.scheduler(fn)
        } else {
            fn()
        }
    })
}

/**用一个全局变量存被注册的副作用函数*/
let activeEffect: EffectFunc | undefined
/** 副作用函数栈
 * 使用副作用函数栈存储和使用副作用函数，避免在嵌套的副作用函数中 get 获取到错误的副作用函数
 */
const effectStack: any[] = []
/*注册副作用函数*/
export function registerEffect(fn: Function, options: EffectFuncOptions = { label: "" }): EffectFunc {
    // A方式: 原本没有闭包的情况下，activeEffect 在读取变量时没有及时修改，导致出现 effect 挂在错误的 key 上
    //  set() => fn() => get() => 将key和当前activeEffect绑定，此时的activeEffect指向的可能是错的。
    /*
    console.warn('[effectFn] activeEffect change:', label);
    activeEffect = fn;
    fn()
    */

    // B方式: 在每次执行副作用函数时，都重新设置 activeEffect ，确保get的时候拿到的是正确的 activeEffect。
    // set() => effectFn() => 修改activeEffect指向effectFn => fn() => get() => 将key和当前activeEffect绑定
    const effectFn: EffectFunc = () => {
        cleanup(effectFn)
        activeEffect = effectFn;
        console.warn('[effectFn] activeEffect change1:', activeEffect?.options?.label);
        effectStack.push(effectFn)
        const res = fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        console.warn('[effectFn] activeEffect change2:', activeEffect?.options?.label);
        return res
    }
    // deps 用于存储该副作用函数关联的对象属性
    effectFn.deps = [] as any[]
    effectFn.options = options
    // 只有在非lazy的时候才执行副作用
    if (!options.lazy) {
        effectFn()
    }
    return effectFn
}
/** 重置副作用的对象属性的关联 */
function cleanup(effectFn: EffectFunc) {
    if (effectFn.deps && effectFn.deps.length > 0) {
        effectFn.deps.forEach(item => {
            item.delete(effectFn as any)
        })
        effectFn.deps.length = 0
    }
}

