import { createRenderer, VirtualElement } from '../src'

const renderer = createRenderer()
const container = document.querySelector("#app")
if (container) {
    const el = new VirtualElement("h1", "h1", {
        id: "title",
        onClick: () => {
            console.log("click h1 tag!")
        }
    })
    renderer.render(el, container)
    setTimeout(() => {
        renderer.render(new VirtualElement("div", [
            new VirtualElement("h2", "h2", {
                id: "title"
            })
        ], {
            id: "wrapper",
            onClick: [
                () => {
                    console.log("log1: click h2 tag!")
                }, () => {
                    console.log("log2: click h2 tag!")
                }
            ],
            onMouseover: () => {
                console.log("hover h2 tag!")
            }
        }), container)
        setTimeout(() => {
            renderer.render(undefined, container)
        }, 10000);
    }, 1000);
}