import { createRenderer, VirtualElement, ref, registerEffect } from '../src'

const isActive = ref(false)

const renderer = createRenderer()
registerEffect(() => {
    console.log('副作用函数执行', isActive.value);
    const container = document.querySelector("#app")
    if (container) {
        const vnode = new VirtualElement("div", {
            id: "wrapper",
            style: "background: " + (isActive.value ? "#f00" : "#0f0"),
            ...isActive.value ? {
                onClick: [
                    () => {
                        console.log(" click wrapper tag!")
                    }
                ],
            } : {}
        }, [
            new VirtualElement("h2", {
                id: "title",
                onClick: [
                    () => {
                        console.log(" click h2 tag!")
                        isActive.value = true
                    }
                ],
            }, "h2")
        ])
        renderer.render(vnode, container)
    }
}, {
    label: "renderer"
})
