import { createRenderer, VirtualElement } from '../src'
import { ComponentOptions } from '../src/component/component'
// 子组件选项
const childOptions: ComponentOptions = {
    props: {
        name: String
    },
    data() {
        return {}
    },
    render() {
        const state = this as any
        return new VirtualElement("li", {}, state.name, "child")
    }
}
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
    render() {
        const state = this as any
        return new VirtualElement("ol", {
            class: "list",
            onClick: () => {
                state.isActive = !state.isActive,
                    state.number++
            }
        }, [
            // 插入子组件节点，props 传参
            new VirtualElement(childOptions, { name: "child" + state.number }, [], "childComp"),
            ...(!state.isActive ?
                ["1", "3", "4", "2"] : ["5", "1", "2", "4"]
            ).map(item => new VirtualElement("li", {}, item + " " + state.number, item))
        ],
            "wrapper")
    }
}
// 创建组件虚拟节点
const CompNode = new VirtualElement(componentOptions, {}, [], "comp")
const container = document.querySelector("#app")
const renderer = createRenderer()
// 渲染节点
container && renderer.render(CompNode, container)
