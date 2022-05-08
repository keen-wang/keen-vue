import { createRenderer, VirtualElement, ref, registerEffect, VText, VComment, VFragment } from '../src'

const isActive = ref(false)

const renderer = createRenderer()
registerEffect(() => {
    const container = document.querySelector("#app")
    if (container) {
        const vnode = new VirtualElement("ol", {
            class: "list",
        }, [
            new VirtualElement(VFragment, {}, [
                "1", "2", "3"
            ].map(item => new VirtualElement("li", {}, item)))
        ])
        renderer.render(vnode, container)
        setTimeout(() => {
            const vnode1 = new VirtualElement("ol", {
                class: "list",
            }, [
                new VirtualElement(VFragment, {}, [
                    "2", "3", "3"
                ].map(item => new VirtualElement("li", {}, item)))
            ])
            renderer.render(vnode1, container)
        }, 1000);
    }
}, {
    label: "renderer"
})

