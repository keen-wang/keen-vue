import { createRenderer, VirtualElement, ref, registerEffect, VText, VComment, VFragment } from '../src'

const isActive = ref(false)

const renderer = createRenderer()
registerEffect(() => {
    const container = document.querySelector("#app")
    if (container) {
        const vnode = new VirtualElement("ol", {
            class: "list",
            onClick: () => {
                isActive.value = !isActive.value
            }
        }, (!isActive.value ?
            ["1", "3", "4", "2"] : ["5", "1", "2", "4"]
        ).map(item => new VirtualElement("li", {}, item + " " + isActive.value, item)), "wrapper")
        renderer.render(vnode, container)
    }
}, {
    label: "renderer"
})

