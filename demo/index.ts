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
        }, [
            new VirtualElement(VFragment, {}, (!isActive.value ?
                ["1", "2", "3"] : ["3", "1", "2"]
            ).map(item => new VirtualElement("li", {}, item + " " + isActive.value, item)))
        ], "wrapper")
        renderer.render(vnode, container)
    }
}, {
    label: "renderer"
})

