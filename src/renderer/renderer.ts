import { VirtualElement } from "./virtualElement";
export function createRenderer() {
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
        const el = document.createElement(vnode.type)
        // 处理子节点
        if (typeof vnode.children === "string") {
            // 字符串类型设置textContent
            el.textContent = vnode.children
        }
        container.appendChild(el)
    }

    return {
        render
    }
}
