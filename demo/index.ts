import { registerEffect, reactive, computed, watch } from './reactive'
// 原始数据
const originData: any = { text: 1, title: "old title", showText: true }
// 原始数据代理
const data = reactive(originData)

let text: number | undefined = undefined
let title: string | undefined = undefined

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
    title = data.title
    console.log('title change!', title);
    document.getElementById("title")!.innerText = title || ""
}, {
    label: "titleEffect"
})

// // 计算属性获取 text + title
// const getTextAndTitle = computed(() => (data.title + ": " + data.text))

// registerEffect(()=>{
//     // 读取四次getTextAndTitle.value, 计算属性的副作用函数只执行一次
//     console.log('computed getTextAndTitle change!1', getTextAndTitle.value);
//     console.log('computed getTextAndTitle change!2', getTextAndTitle.value);
//     console.log('computed getTextAndTitle change!3', getTextAndTitle.value);
//     document.getElementById("computed")!.innerText = getTextAndTitle.value
// }, {
//     label: "textAndTitleEffect"
// })

watch(() => data.text, (a: any, b: any) => {
    console.log("watch data change", a, b)
})

setTimeout(() => {
    console.log('one second later',);
    data.text = 20000
    data.title = "Title"
    data.text = 100
}, 1000);