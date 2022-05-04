import { createRenderer, VirtualElement } from '../src'

const renderer = createRenderer()
const container = document.querySelector("#app")
if (container) {
    const el = new VirtualElement("div", [
        new VirtualElement("p", "what?")
    ], {
        id: "wrapper"
    })
    renderer.render(el, container)
}