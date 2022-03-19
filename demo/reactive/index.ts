
/**
 *  存储副作用函数的集合： WeakMap 将闭包作用域中的对象强引用，避免影响垃圾回收。
 */
const bucket: WeakMap<object, Map<string | Symbol, Set<Function>>> = new WeakMap()
/** 数据响应式 */
export function reactive<T extends object>(origin: T): T {
    return new Proxy(origin, {
        get(target, key) {
            trace(target, key)
            // @ts-ignore 
            return target[key]
        },
        set(target, key, value) {
            // @ts-ignore 设置新值
            target[key] = value
            trigger(target, key)
            return true
        }
    })
}
/** 追踪属性 */
function trace(target: any, key: string | symbol) {
    console.warn('[trace] Bind key and effect: ', key, activeEffect.label);
    if (!activeEffect) return
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
    // TODO: 何时去掉这里的 ativeEffect 避免读取别的属性时把这个方法添加到依赖
}
/** 触发副作用函数 */
function trigger(target: any, key: string | symbol) {
    // 获取副作用函数
    const depMap = bucket.get(target)
    if (!depMap) return
    const effects = depMap.get(key)
    effects && effects.forEach(fn => fn())
}

/**用一个全局变量存被注册的副作用函数*/
let activeEffect: any | undefined
/*注册副作用函数*/
export function registerEffect(fn: Function, label?: string) {
    // A方式: 原本没有闭包的情况下，activeEffect 在读取变量时没有及时修改，导致出现 effect 挂在错误的 key 上
    //  set() => fn() => get() => 将key和当前activeEffect绑定，此时的activeEffect指向的可能是错的。
    /*
    console.warn('[effectFn] activeEffect change:', label);
    activeEffect = fn;
    fn()
    */

    // B方式: 在每次执行副作用函数时，都重新设置 activeEffect ，确保get的时候拿到的是正确的 activeEffect。
    // set() => effectFn() => 修改activeEffect指向effectFn => fn() => get() => 将key和当前activeEffect绑定
    const effectFn = () => {
        console.warn('[effectFn] activeEffect change:', effectFn.label);
        activeEffect = effectFn;
        fn()
    }
    effectFn.label = label
    effectFn()
}

