import { createRenderer, VirtualElement, ref, registerEffect, VText, VComment, VFragment } from '../src'

// 组件选项
const componentOptions = {
    name: "component",
    data() {
        return {
            title: "hello world",
            isActive: false
        }
    },
    render(state: any) {
        return new VirtualElement("ol", {
            class: "list",
            onClick: () => {
                state.isActive = !state.isActive
            }
        }, (["1", "3", "4", "2"]
        ).map(item => new VirtualElement("li", {}, item + " " + state.isActive, item)), "wrapper")
    }
}
// 创建组件虚拟节点
const CompNode = new VirtualElement(componentOptions, {}, [], "comp")
const container = document.querySelector("#app")
const renderer = createRenderer()
// 渲染节点
container && renderer.render(CompNode, container)
