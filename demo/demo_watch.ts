import { registerEffect, reactive, watch } from '../src'
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

// mockHttpReq 模拟http请求,第一次耗时8s,第二次耗时6s
const mockHttpReq = (() => {
    let id = 1
    let costTime = 10
    return (): Promise<string> => {
        return new Promise(resolve => {
            let myCost = costTime -= 2;
            let myID = id++;
            console.log("start requestId: " + myID)
            setTimeout(() => {
                resolve(`respId: ${myID}, costTime: ${myCost}s`)
            }, myCost * 1000);
        })
    }
})()

watch(() => data.text, async (a: any, b: any, onInvalidate: Function) => {
    console.log('watch change', a, b);
    let expired = false
    onInvalidate(() => {
        expired = true
    })
    const result = await mockHttpReq()
    console.log('resp: ', result);
    if (!expired) {
        // 利用 onInvalidate 确保result是最后一个请求的结果
        document.getElementById("watch")!.innerText = result
    }
})


setTimeout(() => {
    console.log('one second later',);
    data.title = "Title"
    data.text = 20000
    data.text = 100
    data.text = 100
}, 1000);