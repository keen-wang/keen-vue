type JobFunc = (func: Function) => void
export function getQueueJob(): JobFunc {
    // 任务队列,用于过滤同个副作用函数
    const queue: Set<Function> = new Set()
    // 标识队列是否正在刷新
    let isFlushing = false
    // 队列调度器
    return function queueJon(job) {
        queue.add(job)
        if (!isFlushing) {
            isFlushing = true
            // 异步等待刷新结束再执行
            setTimeout((() => {
                try {
                    queue.forEach(job => job())
                } finally {
                    isFlushing = false
                    queue.clear()
                }
            }), 0);
        }
    }

}