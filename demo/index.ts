import { registerEffect, reactive } from './reactive'
// 原始数据
const originData: any = { text: 1, title: "old title", showText: true }
// 原始数据代理
const data = reactive(originData)

let text: number | undefined = undefined
let title: string | undefined = undefined

registerEffect(() => {
    // titleEffect 嵌套在 textEffect 中
    registerEffect(() => {
        title = data.title
        console.log('title change!', title);
        document.getElementById("title")!.innerText = title || ""
    }, "titleEffect")
    // 副作用函数对属性修改，触发无限递归执行副作用函数
    text = data.text++
    console.log('text change!', text);
    document.getElementById("app")!.innerText = text + "    "
}, "textEffect")

setTimeout(() => {
    console.log('one second later',);
    data.text = 2
    // data.title = "Title"
}, 1000);