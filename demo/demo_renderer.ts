import { createRenderer, VirtualElement, ref, registerEffect, VText, VComment, VFragment } from '../src'

const isActive = ref(false)

const renderer = createRenderer()
registerEffect(() => {
    console.log('副作用函数执行', isActive.value);
    const container = document.querySelector("#app")
    if (container) {
        const vnode = new VirtualElement("div", {
            id: "wrapper",
            style: "background: " + (isActive.value ? "#8888e3" : "#aaf373"),
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
            }, [new VirtualElement(VText, {}, "h1"), new VirtualElement(VComment, {}, "这是注释")]),
            ...isActive.value ? [
                new VirtualElement("h3", {
                    id: "title3",
                    onClick: [
                        () => {
                            console.log(" click h3 tag!")
                            isActive.value = true
                        }
                    ],
                }, "h3"),

                new VirtualElement("ol", {
                    class: "list",
                }, [
                    new VirtualElement(VFragment, {}, [
                        "1", "2", "3"
                    ].map(item => new VirtualElement("li", {}, item)))
                ])
            ] : []
        ])
        renderer.render(vnode, container)
    }
}, {
    label: "renderer"
})

