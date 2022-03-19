import { registerEffect, reactive } from './reactive'
// 原始数据
const originData: any = { text: "Hello World!", title: "", showText: true }
// 原始数据代理
const data = reactive(originData)
const textEffect = () => {
    // 三元表达式 根据data.showText的值出现分支切换
    // const text = data.showText ? data.text : "hide text"
    const text = data.text
    console.log('text change!', text);
    document.getElementById("app")!.innerText = text
}
textEffect.label = "textEffect"
registerEffect(textEffect, textEffect.label)
const titleEffect = () => {
    const title = data.title
    console.log('title change!', title);
    document.getElementById("title")!.innerText = title
}
titleEffect.label = "titleEffect"
registerEffect(titleEffect, titleEffect.label)

setTimeout(() => {
    // data.showText = false
    data.text = "Hello Keen!" + Date.now()
    // setInterval(() => {
    //     data.text = "Hello Keen!" + Date.now()
    // }, 1000)
    data.title = "Title"
}, 1000);