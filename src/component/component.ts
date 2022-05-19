import { VirtualElement } from '../renderer/virtualElement'

type RenderFunc = () => VirtualElement

export interface ComponentOptions {
    name?: string;
    render?: RenderFunc,
    data?: Function;
    // 参数
    props?: any;
    // 生命周期函数
    beforeCreate?: Function;
    created?: Function;
    beforeMount?: Function;
    mounted?: Function;
    beforeUpdate?: Function;
    updated?: Function;
    // setup 函数用于调用组合 API
    setup?: (props: any, setupContext: any) => RenderFunc | any
}
export class VComponent {
    isMounted: boolean = false
    public subTree: VirtualElement | null = null
    constructor(public state: any, public props: any) {

    }
}