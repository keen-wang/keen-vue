import { registerEffect, ref } from '../src'

// 原始数据
const originData: any = {
    body: { title: "unknown" }
}
// 原始数据代理
// const data = reactive(originData)
const data = ref(10)


registerEffect(() => {
    const title = data.value
    console.log("title change: ", title)
    document.getElementById("title")!.innerText = title
}, {
    label: "titleEffect"
})

setTimeout(() => {
    console.log('one second later',);
    data.value = 2000
}, 1000);