import { createRenderer, VirtualElement, ref, registerEffect, TextType, CommentType } from '../src'

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
            }, [new VirtualElement(TextType, {}, "h1"), new VirtualElement(CommentType, {}, "这是注释")]),
            ...isActive.value ? [
                new VirtualElement("h3", {
                    id: "title3",
                    onClick: [
                        () => {
                            console.log(" click h3 tag!")
                            isActive.value = true
                        }
                    ],
                }, "h3")
            ] : []
        ])
        renderer.render(vnode, container)
    }
}, {
    label: "renderer"
})

