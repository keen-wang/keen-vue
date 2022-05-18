import { createRenderer, VirtualElement } from '../src'
import { ComponentOptions } from '../src/component/component'

// 组件选项
const componentOptions: ComponentOptions = {
    name: "component",
    data() {
        return {
            title: "hello world",
            isActive: false,
            number: 0
        }
    },
    props: {
        title: String
    },
    render(state: any) {
        return new VirtualElement("ol", {
            class: "list",
            onClick: () => {
                state.isActive = !state.isActive,
                    state.number++
            }
        }, (!state.isActive ?
            ["1", "3", "4", "2"] : ["5", "1", "2", "4"]
        ).map(item => new VirtualElement("li", {}, item + " " + state.number, item)), "wrapper")
    }
}
// 创建组件虚拟节点
const CompNode = new VirtualElement(componentOptions, {}, [], "comp")
const container = document.querySelector("#app")
const renderer = createRenderer()
// 渲染节点
container && renderer.render(CompNode, container)
