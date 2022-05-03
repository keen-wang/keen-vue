import { VirtualElement } from "./virtualElement";

interface OperationOptions {
    createElement: (tag: string) => Element,
    setElementText: (el: Element, text: string) => void,
    insert: (el: Element, parent: Element, anchor: Element | null) => void
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
    })
}
export function createRenderer(options: OperationOptions = browserOptions) {
    let { createElement, setElementText, insert } = options
    function render(vnode: VirtualElement | undefined, container: Element) {
        const originNode = (container as any)._vnode
        if (vnode) {
            // 更新dom内容
            patch(originNode, vnode, container)
        } else {
            if (originNode) {
                // vnode 不存在，原来的已经挂载，则进行卸载 unmount 操作
                container.innerHTML = ""
            }
        }
        (container as any)._vnode = vnode
    }
    function patch(origin: VirtualElement, newNode: VirtualElement, container: Element) {
        if (!origin) {
            // 原节点不存在则进行挂载 mount
            mountElement(newNode, container)
        } else {
            // n1 存在则进行打补丁
        }
    }
    function mountElement(vnode: VirtualElement, container: Element) {
        // 创建dom
        const el = createElement(vnode.type)
        // 处理子节点
        if (typeof vnode.children === "string") {
            // 字符串类型设置textContent
            setElementText(el, vnode.children)
        }
        insert(el, container, null)
    }

    return {
        render
    }
}
