import { createRenderer, VirtualElement } from '../src'

const renderer = createRenderer()
const container = document.querySelector("#app")
if (container) {
    const el = new VirtualElement("h1", "h1", {
        id: "title"
    })
    renderer.render(el, container)
    setTimeout(() => {
        renderer.render(new VirtualElement("h5", "h5", {
            id: "title  "
        }), container)
        setTimeout(() => {
            renderer.render(undefined, container)
        }, 2000);
    }, 1000);
}