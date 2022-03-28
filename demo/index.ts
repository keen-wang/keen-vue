import { registerEffect, reactive } from '../src'
// 原始数据
const originData: any = {
    text: "hello AAA",
    title: "old title"
}
// 原始数据代理
const data = reactive(originData)

let text: number | undefined = undefined

// textEffect
registerEffect(() => {
    text = data.text
    console.log('text change!', text);
    document.getElementById("app")!.innerText = text + ""
}, {
    // scheduler(fn) {
    //     setTimeout(fn);
    // },
    label: "textEffect"
})


// titleEffect
registerEffect(() => {
    // const title = data.title
    // console.log('title change!', title);
    // document.getElementById("title")!.innerText = title || ""
    // data.tellMeWhatIsText()
    if("title" in data) {
        console.log(('title changed!!!'))
    }
}, {
    label: "titleEffect"
})

setTimeout(() => {
    console.log('one second later',);
    // 这里需要触发 titleEffect 函数
    data.title = "new title"
}, 1000);