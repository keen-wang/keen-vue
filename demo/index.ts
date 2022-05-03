import { createRenderer, VirtualElement } from '../src'

const renderer = createRenderer()
const container = document.querySelector("#app")
if (container) {
    const el = new VirtualElement("h1", "hello world")
    renderer.render(el, container)
}