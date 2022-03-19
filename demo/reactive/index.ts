export function main() {
    // 存储副作用函数的集合： WeakMap 将闭包作用域中的对象强引用，避免影响垃圾回收。
    const bucket: WeakMap<object, Map<string | Symbol, Set<Function>>> = new WeakMap()
    // 原始数据
    const originData: any = { text: "Hello World!", h1: "", showText: false }
    // 原始数据代理
    const data = new Proxy(originData, {
        get(target, key) {
            trace(target, key)
            return target[key]
        },
        set(target, key, value) {
            // 设置新值
            target[key] = value
            trigger(target, key)
            return true
        }
    })

    /** 追踪属性 */
    function trace(target: any, key: string | symbol) {
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

    function trigger(target: any, key: string | symbol) {
        // 获取副作用函数
        const depMap = bucket.get(target)
        if (!depMap) return
        const effects = depMap.get(key)
        effects && effects.forEach(fn => fn())
    }

    // 用一个全局变量存被注册的副作用函数
    let activeEffect: Function | undefined
    /*注册副作用函数*/
    function registerEffect(fn: Function) {
        // 保存副作用函数
        activeEffect = fn
        fn()
    }
    registerEffect(() => {
        console.log('text change!', data.text);
        document.getElementById("app")!.innerText = data.showText ? data.text : ""
    })
    registerEffect(() => {
        console.log('title change!', data.h1);
        document.getElementById("title")!.innerText = data.h1
    })

    setTimeout(() => {
        data.text = "Hello Keen!"
        data.h1 = "Title"
    }, 1000);


}