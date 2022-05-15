import { VirtualElement, VText, VComment, VFragment } from "./virtualElement";
interface OperationOptions {
    createElement: (tag: string) => Element,
    setElementText: (el: Element, text: string) => void,
    insert: (el: Element | Text | Comment, parent: Element, anchor: ChildNode | null) => void,
    patchProps: (el: any, key: string, preValue: any, value: any) => void,
    createText: (text: string) => Text,
    setText: (el: Text, text: string) => void,
    createComment: (text: string) => Comment,
    setComment: (el: Comment, text: string) => void,
}

// 将浏览器的api作为配置项参数传入，增加扩展性
const browserOptions: OperationOptions = {
    createElement: ((tag: string): Element => {
        return document.createElement(tag)
    }),
    setElementText: ((el: Element, text: string): void => {
        el.textContent = text
    }),
    insert: ((el: Element | Text | Comment, parent: Element, anchor: ChildNode | null = null): void => {
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
                        // 如果事件触发时间没有绑定监听事件，则不执行回调
                        if (e.timeStamp < invoker.attachedTime) return
                        //  伪造事件函数执行时，执行真正的事件函数
                        if (Array.isArray(invoker.value)) {
                            invoker.value.forEach((fn: Function) => fn(e))
                        } else {
                            invoker.value(e)
                        }
                    }
                    invoker.value = value
                    invoker.attachedTime = performance.now()
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
    },
    createText: ((text: string): Text => {
        return document.createTextNode(text)
    }),
    setText: ((el: Text, text: string): void => {
        el.nodeValue = text
    }),
    createComment: ((text: string): Comment => {
        return document.createComment(text)
    }),
    setComment: ((el: Comment, text: string): void => {
        el.nodeValue = text
    }),
}
export function createRenderer(options: OperationOptions = browserOptions) {
    let { createElement, setElementText, insert, patchProps, createText, setText, createComment, setComment } = options
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
    function patch(oldNode: VirtualElement | null, newNode: VirtualElement, container: Element, anchor: Element | null = null) {
        if (oldNode && oldNode.type !== newNode.type) {
            // 原节点不存在则进行挂载 mount
            unmount(oldNode)
            oldNode = null
        }
        const { type } = newNode;
        if (typeof type === "string") {
            if (!oldNode) {
                mountElement(newNode, container, anchor)
            } else {
                // origin 存在则进行打补丁
                patchElement(oldNode, newNode)
            }
        } else if (type === VText && typeof newNode.children === "string") {
            // 渲染文本节点
            if (!oldNode) {
                const el = newNode.el = createText(newNode.children)
                insert(el, container, anchor)
            } else {
                const el = newNode.el = oldNode.el
                if (newNode.children !== oldNode.children) {
                    setText(el, newNode.children)
                }
            }
        } else if (type === VComment && typeof newNode.children === "string") {
            // 渲染注释节点
            if (!oldNode) {
                const el = newNode.el = createComment(newNode.children)
                insert(el, container, anchor)
            } else {
                const el = newNode.el = oldNode.el
                if (newNode.children !== oldNode.children) {
                    setComment(el, newNode.children)
                }
            }
        } else if (type === VFragment && Array.isArray(newNode.children)) {
            // 渲染注释节点
            if (!oldNode) {
                // 旧节点不存在，直接将 Fragment 挂载在容器
                newNode.children.forEach(item => mountElement(item, container))
            } else {
                // 如果旧节点存在，只需要更新 Fragment 的子节点
                patchChildren(oldNode, newNode, container)
            }
        } else if (typeof type === "object") {
            // 处理组件
        }
    }
    /**
     * 更新元素
     * @param oldNode 
     * @param newNode 
     */
    function patchElement(oldNode: VirtualElement, newNode: VirtualElement) {
        const el: any = newNode.el = oldNode.el
        // 处理元素属性 props
        const oldProps = oldNode.props
        const newProps = newNode.props
        for (const key in newProps) {
            if (newProps[key] !== oldProps[key]) {
                patchProps(el, key, oldProps[key], newProps[key])
            }
        } for (const key in oldProps) {
            if (!(key in newProps)) {
                patchProps(el, key, oldProps[key], null)
            }
        }
        // 处理元素children
        patchChildren(oldNode, newNode, el)
    }
    /**
     * 更新子节点
     * @param oldNode 
     * @param newNode 
     * @param container 
     */
    function patchChildren(oldNode: VirtualElement, newNode: VirtualElement, container: Element) {
        // 判断新子节点是否为文本节点
        if (typeof newNode.children === "string") {
            // 旧节点的类型有三种可能：没有子节点、文本节点、文件及一组子节点
            // 旧节点为一组节点时，先卸载每个节点
            if (Array.isArray(oldNode.children)) {
                oldNode.children.forEach(item => unmount(item));
            }
            // 将新文本内容插入
            setElementText(container, newNode.children)

        } else if (Array.isArray(newNode.children)) {
            if (Array.isArray(oldNode.children)) {
                const newChildList = newNode.children
                const oldChildList = oldNode.children
                indexDiff(oldChildList, newChildList, container)
                // 暴力更新一组子节点，可用 diff 算法优化
                // oldNode.children.forEach(item => unmount(item));
                // 旧节点为一组节点时，先卸载每个节点
                // newNode.children.forEach(item => mountElement(item, container))
            } else {
                setElementText(container, "")
                newNode.children.forEach(item => mountElement(item, container))
            }
        } else {
            // 新子节点为空
            // 旧节点为一组节点时，先卸载每个节点
            if (Array.isArray(oldNode.children)) {
                oldNode.children.forEach(item => unmount(item));
            } else {
                setElementText(container, "")
            }
        }
    }
    function mountElement(vnode: VirtualElement, container: Element, anchor: Element | null = null) {
        if (vnode.type === VFragment && Array.isArray(vnode.children)) {
            vnode.children.forEach(item => {
                mountElement(item, container, anchor)
            });
            return
        } else if (typeof vnode.type !== "string") return
        // 创建dom
        const el: any = vnode.el = createElement(vnode.type)
        // 处理子节点
        if (typeof vnode.children === "string") {
            // 字符串类型设置textContent
            setElementText(el, vnode.children)
        } else if (Array.isArray(vnode.children)) {
            vnode.children.forEach(item => {
                patch(null, item, el)
            })
        }
        // 处理元素属性
        if (vnode.props) {
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key])
            }
        }
        insert(el, container, anchor)
    }
    function unmount(vnode: VirtualElement) {
        if (vnode.type === VFragment && Array.isArray(vnode.children)) {
            vnode.children.forEach(item => {
                unmount(item)
            });
            return
        }
        const parent = vnode.el.parentNode
        if (parent) {
            parent.removeChild(vnode.el)
        }
    }
    /**
     * 简单diff
     * @param oldChildList 
     * @param newChildList 
     * @param container 
     */
    function easyDiff(oldChildList: VirtualElement[], newChildList: VirtualElement[], container: Element) {
        // 简单diff算法
        let lastIndex = 0
        newChildList.find((newChild, i) => {
            const item = oldChildList.find((oldChild, j) => {
                if (newChild.key === oldChild.key && newChild.key !== undefined) {
                    // 更新dom 元素
                    patch(oldChild, newChild, container)
                    if (j < lastIndex) {
                        // 需要移动dom节点
                        const preNode = newChildList[i - 1]
                        if (preNode) {
                            const anchor = (preNode.el as Element).nextSibling
                            insert(newChild.el, container, anchor)
                        }
                    } else {
                        lastIndex = j
                    }
                    return true
                }
            })
            // 新增元素，直接插入
            if (!item) {
                const preNode = newChildList[i - 1]
                let anchor = null
                if (preNode) {
                    anchor = preNode.el.nextSibling
                } else {
                    anchor = container.firstChild
                }
                patch(null, newChild, container, anchor)
            }
            // 寻找被删除的旧元素
            oldChildList.forEach(oldChild => {
                const exist = newChildList.find(newChild => (newChild.key === oldChild.key))
                if (!exist) {
                    // 如果没找到对应新节点，进行删除
                    unmount(oldChild)
                }
            })

        })
    }
    /**
     * 双端diff
     * @param oldChildList 
     * @param newChildList 
     * @param container 
     */
    function indexDiff(oldChildList: VirtualElement[], newChildList: VirtualElement[], container: Element) {

        let oldStartIdx = 0
        let oldEndIdx = oldChildList.length - 1
        let newStartIdx = 0
        let newEndIdx = newChildList.length - 1
        let oldStart = oldChildList[oldStartIdx]
        let oldEnd = oldChildList[oldEndIdx]
        let newStart = newChildList[newStartIdx]
        let newEnd = newChildList[newEndIdx]

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            // 依次横向和交叉比较

            // 如果 oldStart 或 oldEnd 已处理变undefined 则跳过索引
            if (!oldStart) {
                oldStart = oldChildList[++oldStartIdx]
            } else if (!oldEnd) {
                oldEnd = oldChildList[--oldEndIdx]
            } else if (oldStart.key === newStart.key) {
                // 无需移动，修改索引
                patch(oldStart, newStart, container)
                oldStart = oldChildList[++oldStartIdx]
                newStart = newChildList[++newStartIdx]
            } else if (oldEnd.key === newEnd.key) {
                // 无需移动，修改索引
                patch(oldEnd, newEnd, container)
                oldEnd = oldChildList[--oldEndIdx]
                newEnd = newChildList[--newEndIdx]
            } else if (oldStart.key === newEnd.key) {
                // 更新元素
                patch(oldStart, newEnd, container)
                // 移动元素到最后
                insert(oldStart.el, container, oldEnd.el.nextSibling)
                // 修改索引
                oldStart = oldChildList[++oldStartIdx]
                newEnd = newChildList[--newEndIdx]
            } else if (oldEnd.key === newStart.key) {
                // 更新元素
                patch(oldEnd, newStart, container)
                // 移动元素到最前面
                insert(oldEnd.el, container, oldStart.el)
                // 修改索引
                oldEnd = oldChildList[--oldEndIdx]
                newStart = newChildList[++newStartIdx]
            } else {
                // 处理没有找到对应的节点,
                let oldIndex = -1
                let oldNode: VirtualElement | null = null
                for (let index = oldStartIdx; index < oldEndIdx + 1; index++) {
                    if (oldNode) break
                    if (oldChildList[index] && oldChildList[index].key === newStart.key) {
                        oldIndex = index
                        oldNode = oldChildList[index]
                    }
                }
                const anchor = oldStart.el
                if (oldNode) {
                    // 更新元素
                    patch(oldNode, newStart, container)
                    // 移动元素到最前面
                    insert(newStart.el, container, anchor)
                    // 标记已处理旧节点
                    oldChildList[oldIndex] = undefined as any
                } else {
                    patch(null, newStart, container, anchor)
                }
                // 修改索引
                newStart = newChildList[++newStartIdx]
            }
        }
        // 删除剩余节点
        if (oldStartIdx <= oldEndIdx && newEndIdx < newStartIdx) {
            for (let index = oldStartIdx; index < oldEndIdx + 1; index++) {
                const toDelNode = oldChildList[index]
                toDelNode && unmount(oldChildList[index])
            }
        }
        // 插入新增节点
        if (newStartIdx <= newStartIdx && oldEndIdx < oldStartIdx) {
            for (let index = newStartIdx; index < newEndIdx + 1; index++) {
                const toAddNode = newChildList[index]
                patch(null, toAddNode, container, oldStart.el)
            }
        }
    }
    return {
        render
    }
}
