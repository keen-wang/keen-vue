import { createRenderer, VirtualElement, ref, registerEffect, VText, VComment, VFragment } from '../src'

const isActive = ref(false)
const vNode = new VirtualElement("ol", {
    class: "list",
    onClick: () => {
        isActive.value = !isActive.value
    }
}, (!isActive.value ?
    ["1", "3", "4", "2"] : ["5", "1", "2", "4"]
).map(item => new VirtualElement("li", {}, item + " " + isActive.value, item)), "wrapper")
// 组件选项
const componentOptions = {
    name: "component",
    data() {
        return {
            title: "hello world"
        }
    },
    render() {
        return vNode
    }
}
// 创建组件虚拟节点
const CompNode = new VirtualElement(componentOptions, {}, [], "comp")
const container = document.querySelector("#app")
const renderer = createRenderer()
// 渲染节点
container && renderer.render(CompNode, container)
