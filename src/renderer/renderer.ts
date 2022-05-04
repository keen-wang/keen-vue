import { VirtualElement } from "./virtualElement";

interface OperationOptions {
    createElement: (tag: string) => Element,
    setElementText: (el: Element, text: string) => void,
    insert: (el: Element, parent: Element, anchor: Element | null) => void,
    patchProps: (el: any, key: string, preValue: any, value: any) => void
}

// 将浏览器的api作为配置项参数传入，增加扩展性
const browserOptions: OperationOptions = {
    createElement: ((tag: string): Element => {
        return document.createElement(tag)
    }),
    setElementText: ((el: Element, text: string): void => {
        el.textContent = text
    }),
    insert: ((el: Element, parent: Element, anchor: Element | null = null): void => {
        parent.insertBefore(el, anchor)
    }),
    patchProps(el: any, key: string, preValue: any = null, value: any) {
        // 兼容 setAttribute 和 DOM properties 属性设置的缺陷
        if (/^on/.test(key)) {
            // 使用invoker 伪造事件函数可以减少 addEventListener 的调用，优化性能
            const invokerMap = el._vei || (el._vei = {})
            let invoker = invokerMap[key]
            const name = key.slice(2).toLowerCase()
            if (value) {
                if (!invoker) {
                    // 如果没有invoker 则伪造一个存在el._vei, vei-> vue event invoker
                    invoker = el._vei[key] = (e: Event) => {
                        //  伪造事件函数执行时，执行真正的事件函数
                        if (Array.isArray(invoker.value)) {
                            invoker.value.forEach((fn: Function) => fn(e))
                        } else {
                            invoker.value(e)
                        }
                    }
                    invoker.value = value
                    el.addEventListener(name, invoker)
                } else {
                    // invoker 存在的话只需要修改value
                    invoker.value = value
                }
            } else if (invoker) {
                // 移除事件
                el.removeEventListener(name, invoker)
            }
        } else if (key === "class") {
            // className 设置类名比 setAttr el.classList 性能更优
            el.className = value || ""
        } else if (shouldSetAsProps(el, key, value)) {
            const type = typeof el[key]
            if (type === "boolean" && value === "") {
                el[key] = true
            } else {
                el[key] = value
            }
        } else {
            el.setAttribute(key, value)
        }
        function shouldSetAsProps(el: any, key: string, value: any): boolean {
            if (key === "fom" && el.tagName === "input") return false
            return key in el
        }
    }
}
export function createRenderer(options: OperationOptions = browserOptions) {
    let { createElement, setElementText, insert, patchProps } = options
    function render(vnode: VirtualElement | undefined, container: Element) {
        const originNode = (container as any)._vnode
        if (vnode) {
            // 更新dom内容
            patch(originNode, vnode, container)
        } else {
            if (originNode) {
                // vnode 不存在，原来的已经挂载，则进行卸载 unmount 操作
                unmount(originNode)
            }
        }
        (container as any)._vnode = vnode
    }
    function patch(oldNode: VirtualElement | null, newNode: VirtualElement, container: Element) {
        if (oldNode && oldNode.type !== newNode.type) {
            // 原节点不存在则进行挂载 mount
            unmount(oldNode)
            oldNode = null
        }
        const { type } = newNode;
        if (typeof type === "string") {
            if (!oldNode) {
                mountElement(newNode, container)
            } else {
                // origin 存在则进行打补丁
                // patchElement(oldNode,newNode)
            }
        } else if (typeof type === "object") {
            // 处理组件
        } else if (type === "xxx") {
            // 处理其他类型
        }
    }
    function mountElement(vnode: VirtualElement, container: Element) {
        // 创建dom
        const el: any = vnode.el = createElement(vnode.type)
        // 处理子节点
        if (typeof vnode.children === "string") {
            // 字符串类型设置textContent
            setElementText(el, vnode.children)
        }
        // 处理元素属性
        if (vnode.props) {
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key])
            }
        }
        insert(el, container, null)
    }
    function unmount(vnode: VirtualElement) {
        const parent = vnode.el.parentNode
        if (parent) {
            parent.removeChild(vnode.el)
        }
    }
    return {
        render
    }
}
