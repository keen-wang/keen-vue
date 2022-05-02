import { registerEffect, reactive, toRefs } from '../src'

// 原始数据
const originData: any = {
    title: "unknown",
    text: "what"
}
// 原始数据代理
const data = reactive(originData)
const newData = {
    ...toRefs(data)
}

registerEffect(() => {
    const title = newData.title.value
    console.log("title change: ", title)
    document.getElementById("title")!.innerText = title
}, {
    label: "titleEffect"
})

setTimeout(() => {
    console.log('one second later',);
    newData.title.value = "new title"
}, 1000);