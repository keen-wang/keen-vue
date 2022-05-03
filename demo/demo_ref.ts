import { registerEffect, reactive, toRefs, proxyRefs } from '../src'

// 原始数据
const originData: any = {
    title: "unknown",
    text: "what"
}
// 原始数据代理
const data = reactive(originData)
const newData = proxyRefs({
    ...toRefs(data)
})

registerEffect(() => {
    const title = newData.title
    console.log("title change: ", title)
    document.getElementById("title")!.innerText = title
}, {
    label: "titleEffect"
})

setTimeout(() => {
    console.log('one second later',);
    newData.title = "new title"
}, 1000);