import { registerEffect, reactive, watch } from '../src'
// 原始数据
const originData: any = {
    text: "hello AAA",
    get title() {
        // this 指向的是原始对象 originData 还是代理对象 data ?
        return this.text
    },
    tellMeWhatIsText() {
        alert(this.text)
    }
}
// 原始数据代理
const data = reactive(originData)

let text: number | undefined = undefined

// // textEffect
// registerEffect(() => {
//     text = data.text
//     console.log('text change!', text);
//     document.getElementById("app")!.innerText = text + ""
// }, {
//     // scheduler(fn) {
//     //     setTimeout(fn);
//     // },
//     label: "textEffect"
// })


// titleEffect
registerEffect(() => {
    const title = data.title
    console.log('title change!', title);
    document.getElementById("title")!.innerText = title || ""
    data.tellMeWhatIsText()
}, {
    label: "titleEffect"
})

setTimeout(() => {
    console.log('one second later',);
    // 这里触发了 titleEffect 副作用函数，data.title 的值应该为 BBB
    data.text = "hello BBB"
}, 1000);