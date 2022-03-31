import { registerEffect, readonly, shallRowReadonly } from '../src'

// 原始数据
const originData: any = {
    body: { title: "unknown" }
}
// 原始数据代理
// const data = reactive(originData)
const data = readonly(originData)


registerEffect(() => {
    const title = data.body.title
    console.log("title change: ", title)
    document.getElementById("title")!.innerText = title
}, {
    label: "titleEffect"
})

setTimeout(() => {
    console.log('one second later',);
    data.body = {
        title: "right title!!!"
    }
    data.body.title = "wrong title!!!"
}, 1000);